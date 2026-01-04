async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) return location.href = "login.html";

  const res = await fetch(`${API_URL}/user/me`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const user = await res.json();

  document.getElementById("profileData").innerHTML = `
    <p><b>Username:</b> ${user.username}</p>
    <p><b>UID:</b> ${user.uid}</p>
    <p><b>Coins:</b> ${user.coins}</p>
    <p><b>Gems:</b> ${user.gems}</p>
    <p><b>Level:</b> ${user.level}</p>
    <p><b>Wins:</b> ${user.wins}</p>
    <p><b>Loses:</b> ${user.loses}</p>
  `;
}

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

loadProfile();