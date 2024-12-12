// استرجاع البيانات من التخزين المحلي
document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const password = document.getElementById("password");

  textInput.value = localStorage.getItem("textInput") || "";
  password.value = localStorage.getItem("password") || "";

  toggleClearButton();
});

document.getElementById("encryptButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput").value.trim();
  const password = document.getElementById("password").value;

  if (!password) {
    alert("يرجى إدخال كلمة مرور.");
    return;
  }

  if (textInput) {
    const encryptedText = CryptoJS.AES.encrypt(textInput, password).toString();
    saveCode("encrypted", encryptedText);
    displayOutput(encryptedText);
    downloadFile("encrypted.txt", encryptedText);
    return;
  }

  if (fileInput.files.length) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const fileContent = reader.result;
      const encrypted = CryptoJS.AES.encrypt(fileContent, password).toString();
      saveCode("encrypted", encrypted);
      displayOutput(encrypted);
      downloadFile("encrypted.txt", encrypted);
    };

    reader.onerror = function () {
      alert("حدث خطأ أثناء قراءة الملف.");
    };

    reader.readAsText(file);
    return;
  }

  alert("يرجى كتابة نص أو اختيار ملف.");
});

document.getElementById("decryptButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput").value.trim();
  const password = document.getElementById("password").value;

  if (!password) {
    alert("يرجى إدخال كلمة مرور.");
    return;
  }

  if (textInput) {
    try {
      const decryptedText = CryptoJS.AES.decrypt(textInput, password).toString(CryptoJS.enc.Utf8);

      if (!decryptedText) throw new Error("خطأ في فك التشفير.");

      saveCode("decrypted", decryptedText);
      displayOutput(decryptedText);
      downloadFile("decrypted.txt", decryptedText);
    } catch (error) {
      alert("فشل فك التشفير. يرجى التحقق من النص أو كلمة المرور.");
    }
    return;
  }

  if (fileInput.files.length) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const encryptedContent = reader.result;
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, password).toString(CryptoJS.enc.Utf8);

        if (!decrypted) throw new Error("خطأ في فك التشفير.");

        saveCode("decrypted", decrypted);
        displayOutput(decrypted);
        downloadFile("decrypted.txt", decrypted);
      } catch (error) {
        alert("فشل فك التشفير. يرجى التحقق من الملف أو كلمة المرور.");
      }
    };

    reader.onerror = function () {
      alert("حدث خطأ أثناء قراءة الملف.");
    };

    reader.readAsText(file);
    return;
  }

  alert("يرجى كتابة نص مشفر أو اختيار ملف.");
});

document.getElementById("clearButton").addEventListener("click", () => {
  const textInput = document.getElementById("textInput");
  const password = document.getElementById("password");

  textInput.value = "";
  password.value = "";
  toggleClearButton();

  localStorage.removeItem("textInput");
  localStorage.removeItem("password");
});

document.getElementById("textInput").addEventListener("input", () => {
  const textInput = document.getElementById("textInput");
  toggleClearButton();

  localStorage.setItem("textInput", textInput.value);
});

document.getElementById("password").addEventListener("input", () => {
  localStorage.setItem("password", document.getElementById("password").value);
});

document.getElementById("copyButton").addEventListener("click", () => {
  const output = document.getElementById("output").innerText;

  if (!output) {
    alert("لا يوجد نص لنسخه.");
    return;
  }

  navigator.clipboard.writeText(output).then(
    () => alert("تم نسخ النص بنجاح."),
    () => alert("فشل نسخ النص.")
  );
});

function toggleClearButton() {
  const clearButton = document.getElementById("clearButton");
  const textInput = document.getElementById("textInput").value.trim();

  if (textInput) {
    clearButton.style.display = "block";
  } else {
    clearButton.style.display = "none";
  }
}

function displayOutput(content) {
  const output = document.getElementById("output");
  output.innerText = content;

  const copyButton = document.getElementById("copyButton");
  copyButton.style.display = "block";
}

function downloadFile(filename, content) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function saveCode(type, content) {
  const savedCodes = JSON.parse(localStorage.getItem("savedCodes") || "[]");
  savedCodes.push({ type, content });
  localStorage.setItem("savedCodes", JSON.stringify(savedCodes));
}
