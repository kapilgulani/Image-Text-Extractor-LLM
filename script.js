function processFile(event) {
    const imageFile = event.target.files[0];
    if (!imageFile) {
      return;
    }
    
    // Display the selected image
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageSrc = e.target.result;
      const displayArea = document.getElementById('display1');
      displayArea.innerHTML = '<img src="' + imageSrc + '" alt="Uploaded Image" style="max-width:100%;height:auto;">';
    };
    reader.readAsDataURL(imageFile);
  }
  
  function requestOcrService(base64Image) {
    const headers = new Headers();
    headers.append("apikey", "K87323319888957");
  
    const data = new FormData();
    data.append("base64Image", base64Image);
    data.append("scale", "true");
  
    const config = {
      method: "POST",
      headers: headers,
      body: data,
      redirect: "follow"
    };
  
    fetch("https://api.ocr.space/parse/image", config)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      const outputArea = document.getElementById('display3');
      if(result.ParsedResults && result.ParsedResults.length > 0) {
        let parsedText = result.ParsedResults[0].ParsedText.trim();
        parsedText = parsedText.replace(/\s+/g, ' ').trim(); // Remove extra spaces and line breaks
        outputArea.textContent = parsedText;
      } else {
        console.log("No text found.");
        outputArea.textContent = result.ErrorMessage[0] || "OCR processing error.";
      }
      // Clear processing status
      document.getElementById('display2').textContent = "";
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('display3').textContent = "An error occurred.";
      // Clear processing status
      document.getElementById('display2').textContent = "";
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('processBtn').addEventListener('click', function() {
      const imageInput = document.getElementById('imageInput');
      if(imageInput.files.length > 0) {
        const imageFile = imageInput.files[0];
  
        // Show processing status in Step 2 box
        const displayArea2 = document.getElementById('display2');
        displayArea2.textContent = "Processing...";
  
        // Read the file as base64 to send to the API
        const reader = new FileReader();
        reader.onload = function(e) {
          const base64Image = e.target.result;
          requestOcrService(base64Image);
        };
        reader.readAsDataURL(imageFile);
  
      } else {
        alert("Please upload an image first.");
      }
    });
  });