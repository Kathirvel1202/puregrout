(function () {
  const questions = Array.from(document.querySelectorAll('.faq-question'));
  questions.forEach((question) => {
    question.addEventListener('click', () => {
      const expanded = question.getAttribute('aria-expanded') === 'true';
      const answer = document.getElementById(question.getAttribute('aria-controls'));
      question.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.hidden = expanded;
    });
  });
})();
