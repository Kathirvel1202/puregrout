(function () {
  // Replace these empty values only with business details verified by the owner.
  const BUSINESS = {
    phone: '(555) 789-8453',
    whatsapp: '+15557898453', // International digits only, including country code.
    email: 'service@puregrout.com',
    address: '1428 Grand Avenue, Suite 300, Metro City, NY 10001',
    hours: 'Mon – Sat: 8:00 AM – 6:00 PM (Emergency 24/7 for Commercial)',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus'
  };

  const form = document.querySelector('#booking-form');
  if (!form) return;

  const successPanel = document.querySelector('#booking-success');
  const summaryOutput = document.querySelector('#booking-summary-text');
  const submitButton = document.querySelector('#prepare-request');
  const status = document.querySelector('#form-status');
  const fileInput = document.querySelector('#image-upload');
  const preview = document.querySelector('#image-preview');
  const previewImage = document.querySelector('#image-preview-image');
  const previewName = document.querySelector('#image-preview-name');
  const removeImage = document.querySelector('#remove-image');
  const whatsappLink = document.querySelector('#whatsapp-handoff');
  const emailLink = document.querySelector('#email-handoff');
  const configurationNote = document.querySelector('#handoff-configuration-note');
  const maxFileSize = 8 * 1024 * 1024;
  const validImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  let previewUrl = '';

  const fields = Array.from(form.querySelectorAll('input:not([type="file"]), select, textarea'));
  const localDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };
  const dateField = document.querySelector('#preferred-date');
  dateField.min = localDate();

  function setBusinessDetails() {
    const phoneText = document.querySelector('[data-business-phone-text]');
    const emailText = document.querySelector('[data-business-email-text]');
    const whatsappText = document.querySelector('[data-business-whatsapp-text]');
    const addressText = document.querySelector('[data-business-address-text]');
    const hoursText = document.querySelector('[data-business-hours-text]');
    const locationAddress = document.querySelector('[data-location-address]');

    const phone = BUSINESS.phone.trim();
    if (phone) {
      phoneText.textContent = phone;
      const phoneLink = document.querySelector('[data-business-phone-link]');
      phoneLink.href = `tel:${phone.replace(/[^+\d]/g, '')}`;
      phoneLink.hidden = false;
    }
    if (BUSINESS.email.trim()) {
      emailText.textContent = BUSINESS.email.trim();
      const businessEmailLink = document.querySelector('[data-business-email-link]');
      businessEmailLink.href = `mailto:${BUSINESS.email.trim()}`;
      businessEmailLink.hidden = false;
    }
    if (BUSINESS.whatsapp.trim()) {
      whatsappText.textContent = BUSINESS.whatsapp.trim();
      const businessWhatsAppLink = document.querySelector('[data-business-whatsapp-link]');
      businessWhatsAppLink.href = `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, '')}`;
      businessWhatsAppLink.hidden = false;
    }
    if (BUSINESS.address.trim()) {
      addressText.textContent = BUSINESS.address.trim();
      locationAddress.textContent = BUSINESS.address.trim();
    }
    if (BUSINESS.hours.trim()) hoursText.textContent = BUSINESS.hours.trim();

    if (/^https:\/\//i.test(BUSINESS.mapEmbedUrl.trim())) {
      const placeholder = document.querySelector('.map-placeholder');
      const map = document.createElement('iframe');
      map.src = BUSINESS.mapEmbedUrl.trim();
      map.title = `Map showing ${BUSINESS.address || 'the business location'}`;
      map.loading = 'lazy';
      map.referrerPolicy = 'no-referrer-when-downgrade';
      map.allowFullscreen = true;
      map.className = 'location-map';
      placeholder.replaceChildren(map);
      placeholder.removeAttribute('role');
      placeholder.removeAttribute('aria-label');
    }
  }

  function preselectFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const serviceSelect = document.querySelector('#service-required');
    const packageSelect = document.querySelector('#package-choice');
    const service = params.get('service');
    const packageId = params.get('package');
    const serviceAliases = {
      'grout-cleaning-restoration': 'grout-restoration',
      'general-tile-grout-cleaning': 'complete-cleaning',
      'custom-cleaning-quote': 'other',
      'surface-assessment': 'other',
      'service-question': 'other'
    };
    if (service) {
      const value = serviceAliases[service] || service;
      if (Array.from(serviceSelect.options).some((option) => option.value === value)) serviceSelect.value = value;
    }
    if (packageId && Array.from(packageSelect.options).some((option) => option.value === packageId)) {
      packageSelect.value = packageId;
    }
  }

  function clearError(field) {
    const error = document.querySelector(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = '';
    field.removeAttribute('aria-invalid');
  }

  function showError(field, message) {
    const error = document.querySelector(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    return false;
  }

  function validateField(field) {
    clearError(field);
    if (field.type === 'checkbox') {
      return field.checked || showError(field, 'Please agree before preparing your request.');
    }
    const value = field.value.trim();
    if (field.required && !value) return showError(field, 'Please complete this field.');
    if (!value) return true;

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return showError(field, 'Enter a valid email address.');
    }
    if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return showError(field, 'Enter a phone number with 7 to 15 digits.');
    }
    if (field.type === 'date' && value < localDate()) return showError(field, 'Choose today or a future date.');
    if (field.id === 'full-name' && value.length < 2) return showError(field, 'Enter at least 2 characters.');
    return true;
  }

  function validateImage() {
    const error = document.querySelector('[data-error-for="image-upload"]');
    error.textContent = '';
    fileInput.removeAttribute('aria-invalid');
    const file = fileInput.files && fileInput.files[0];
    if (!file) return true;
    if (!validImageTypes.has(file.type)) {
      error.textContent = 'Choose a JPG, PNG, WebP or GIF image.';
      fileInput.setAttribute('aria-invalid', 'true');
      return false;
    }
    if (file.size > maxFileSize) {
      error.textContent = 'Choose an image smaller than 8 MB.';
      fileInput.setAttribute('aria-invalid', 'true');
      return false;
    }
    return true;
  }

  function readValues() {
    const data = new FormData(form);
    const serviceSelect = document.querySelector('#service-required');
    const propertySelect = document.querySelector('#property-type');
    const packageSelect = document.querySelector('#package-choice');
    const file = fileInput.files && fileInput.files[0];
    return {
      fullName: data.get('fullName').trim(),
      email: data.get('email').trim(),
      phone: data.get('phone').trim(),
      service: serviceSelect.selectedOptions[0].textContent,
      propertyType: propertySelect.selectedOptions[0].textContent,
      areaSize: data.get('areaSize').trim(),
      preferredDate: data.get('preferredDate'),
      preferredTime: data.get('preferredTime'),
      address: data.get('address').trim(),
      packageName: packageSelect.value ? packageSelect.selectedOptions[0].textContent : 'No package selected',
      requirements: data.get('requirements').trim() || 'None provided',
      imageName: file ? file.name : 'No image selected'
    };
  }

  function formatMessage(details) {
    return [
      'Tile & Grout Cleaning — Quote Request',
      '',
      `Name: ${details.fullName}`,
      `Email: ${details.email}`,
      `Phone: ${details.phone}`,
      `Service: ${details.service}`,
      `Property type: ${details.propertyType}`,
      `Approximate area: ${details.areaSize}`,
      `Preferred date: ${details.preferredDate}`,
      `Preferred time: ${details.preferredTime}`,
      `Service address: ${details.address}`,
      `Package preference: ${details.packageName}`,
      `Additional requirements: ${details.requirements}`,
      `Selected image (not attached): ${details.imageName}`
    ].join('\n');
  }

  function setHandoffLink(link, href, isAvailable) {
    link.href = isAvailable ? href : '#';
    link.setAttribute('aria-disabled', String(!isAvailable));
    link.classList.toggle('is-disabled', !isAvailable);
  }

  function prepareHandoffs(details, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = BUSINESS.whatsapp.replace(/\D/g, '');
    const whatsappAvailable = whatsappNumber.length >= 8;
    const emailAddress = BUSINESS.email.trim();
    const emailAvailable = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailAddress);
    setHandoffLink(whatsappLink, `https://wa.me/${whatsappNumber}?text=${encodedMessage}`, whatsappAvailable);
    const subject = encodeURIComponent(`Cleaning quote request — ${details.fullName}`);
    setHandoffLink(emailLink, `mailto:${emailAddress}?subject=${subject}&body=${encodedMessage}`, emailAvailable);
    configurationNote.hidden = whatsappAvailable && emailAvailable;
    if (whatsappAvailable || emailAvailable) {
      configurationNote.textContent = `The ${[whatsappAvailable && 'WhatsApp', emailAvailable && 'email'].filter(Boolean).join(' and ')} option is ready. You will still need to review and send the message in that app.`;
    }
  }

  function handleFileChange() {
    invalidatePreparedRequest();
    if (!validateImage()) {
      clearImagePreview();
      return;
    }
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      clearImagePreview();
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    previewImage.src = previewUrl;
    previewName.textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    preview.hidden = false;
  }

  function clearImagePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    previewImage.removeAttribute('src');
    previewName.textContent = '';
    preview.hidden = true;
  }

  function invalidatePreparedRequest() {
    if (successPanel.hidden) return;
    successPanel.hidden = true;
    status.textContent = 'Your details changed. Prepare your request again to refresh the message.';
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      clearError(field);
      invalidatePreparedRequest();
    });
    field.addEventListener('change', () => {
      clearError(field);
      invalidatePreparedRequest();
    });
  });
  [whatsappLink, emailLink].forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('aria-disabled') !== 'true') return;
      event.preventDefault();
      status.textContent = 'Add the verified business contact details in js/booking.js before using this option.';
    });
  });
  fileInput.addEventListener('change', handleFileChange);
  removeImage.addEventListener('click', () => {
    invalidatePreparedRequest();
    fileInput.value = '';
    clearImagePreview();
    document.querySelector('[data-error-for="image-upload"]').textContent = '';
    fileInput.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    fields.forEach(validateField);
    const validFile = validateImage();
    const firstInvalid = fields.find((field) => field.getAttribute('aria-invalid') === 'true');
    if (firstInvalid || !validFile) {
      if (firstInvalid) firstInvalid.focus();
      else fileInput.focus();
      status.textContent = 'Please review the highlighted fields and try again.';
      successPanel.hidden = true;
      return;
    }

    submitButton.classList.add('is-loading');
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparing your message…';

    window.setTimeout(() => {
      const details = readValues();
      const message = formatMessage(details);
      summaryOutput.textContent = message;
      prepareHandoffs(details, message);
      submitButton.classList.remove('is-loading');
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      status.textContent = 'Your request details are ready to review.';
      successPanel.hidden = false;
      successPanel.focus();
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  });

  setBusinessDetails();
  preselectFromUrl();
})();
