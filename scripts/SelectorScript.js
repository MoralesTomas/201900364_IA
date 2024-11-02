document.addEventListener("DOMContentLoaded", () => {
  
  let selector = document.getElementById("model-selector");
  let sections = document.querySelectorAll(".model-section");
  
  selector.addEventListener("change", () => {
    
    sections.forEach((section) => {
    
      section.style.display = "none";
    
    });

    let modelSelected = selector.value;
    if (modelSelected) {
      document.getElementById(modelSelected).style.display = "block";
    }


  });
});
