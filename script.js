const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const progressContainer = document.querySelector(".progress-container") 
const bgProgress = document.querySelector(".bg-progress");
const progressBar = document.querySelector(".progress-bar");

const fileURLInput = document.querySelector("#fileURL");

const copyBtn = document.querySelector("#copyBtn");

const sharingContainer = document.querySelector(".sharing-container");

const percentDiv = document.querySelector("#percent");

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast")

const url = "InnShare.herokuapp.com";
const uploadURL = `${url}api/files`;
const emailURL = `${url}api/files/send`;

const maxAllowedSize = 100* 1024*1024;

// Add event listener for drag over
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});

// Add event listener for drag leave
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});

// Add event listener for drop
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files.length;
  console.log(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

// Add event listener for file input change
fileInput.addEventListener("change", () => {
  uploadFile();
});

// Add event listener for browse button click
browseBtn.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", ()=>{
fileURLInput.select()
document.execCommand("copy");
showToast("Link copied")
})

const uploadFile = () => {
  progressContainer.style.display = "block"; 
      if(fileInput.files.length > 1){
          fileInput.value = "";
        showToast("Only upload one file!")
        return;
      }

      const file1 = fileInput.files[0];
      if (file1.size > maxAllowedSize) {
        showToast("Can't upload  more than 100MB")
        resetFileInput();
        return;
      }
  emailForm[2].setAttribute("disabled", "true");
  const file = fileInput.files[0];
  if (!file) return; // Handle empty file selection

  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response))
    }
  };

  // Handle progress update with error handling
  xhr.upload.onprogress = updateProgress;
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      // console.log(percent);
      bgProgress.style.width = `${percent}%`;
      percentDiv.innerText = percent;
      progressBar.style.transform = `scaleX(${percent}/100)`
    } else {
      console.log("File size unknown, cannot track progress");
    }
    xhr.upload.onerror = ()=>{
      resetFileInput(); 
        showToast(`Error in upload: ${xhr.statusText}`)
    }
    xhr.open("POST", uploadURL);
   xhr.send(formData);
  };


emailForm.addEventListener("submit", (e)=>{
  e.preventDefault()
  console.log("submit form");
const url =(fileURLInput.value);  
  const formData ={
    uuid:url.split("/").splice(-1,1)[0],
    emailTo:emailForm.elements["to-email"].value,
    emailForm:emailForm.elements["from-email"].value,
  };

  console.table(formData)
  emailForm[2].setAttribute("disabled", "true");
  fetch(emailURL, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(formData)
  }).then(res => res.json()).then(({success})=>{
    if (success) {
      sharingContainer.style.display ="none";
      showToast("Email Sent")
    }
  });
});   

const onUploadSuccess =({file:url})=>{
  console.log(url);
  resetFileInput ();
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURLInput.value = url; 
};

const resetFileInput = ()=> {
  fileInput.value = "";
}

let toastTimer;
const showToast = (msg)=>{
  toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
      clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{
    toast.style.transform = "translate(-50%, 60px)";
    }, 2000)
};