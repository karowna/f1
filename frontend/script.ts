window.onload = () => {
  fetch('http://localhost:5000')
    .then(response => response.json())
    .then(data => {
      const messageElement = document.getElementById('message') as HTMLElement;
      messageElement.innerText = data.message;
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });
};
