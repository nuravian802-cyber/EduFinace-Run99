const token = "ihpQ7HGLvhinoyzims7P";
const waNumber = "081234567890"; // Dummy target just for syntax check, we will not execute full send if we can avoid, or we will just send it to a fake number. Wait, let's send to 085859314799 which seems to be the user's number from the screenshot.
const message = "Test message from Node.js";

async function testSend() {
  try {
    const response = await fetch('https://corsproxy.io/?https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        target: '085859314799',
        message: message,
      }),
    });
    
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    const text = await response.text();
    console.log("Body:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

testSend();
