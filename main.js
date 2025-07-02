// 탭 전환 기능
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    tabContents.forEach(section => {
      section.classList.remove('active');
    });
    if (target === 'lost') {
      document.getElementById('lost-section').classList.add('active');
    } else if (target === 'holder') {
      document.getElementById('holder-section').classList.add('active');
    } else if (target === 'agency') {
      document.getElementById('agency-section').classList.add('active');
    }
  });
}); 