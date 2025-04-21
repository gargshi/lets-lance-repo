const API_BASE = "https://gs341997.pythonanywhere.com/";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function switchForm(startingForm, endingForm,startTab,endTab) {
	startingForm.classList.add("hidden");
	endingForm.classList.remove("hidden");

	// Active styles for login tab
	endTab.classList.remove("text-gray-500", "border-transparent");
	endTab.classList.add("text-blue-600", "border-b-2", "border-blue-500");

	// Inactive styles for register tab
	startTab.classList.remove("text-blue-600", "border-b-2", "border-blue-500");
	startTab.classList.add("text-gray-500");
}

loginTab.addEventListener("click", () => {
	switchForm(registerForm, loginForm,registerTab,loginTab);
});

registerTab.addEventListener("click", () => {
	switchForm(loginForm, registerForm,loginTab,registerTab);
});


// Validation Functions
const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

document.getElementById("toggleLoginPassword").addEventListener("click", () => {
	const pw = document.getElementById("loginPassword");
	const toggle = document.getElementById("toggleLoginPassword");
	if (pw.type === "password") {
		pw.type = "text";
		toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>';
	} else {
		pw.type = "password";
		toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">			<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />			<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>';
	}
});
	
document.getElementById("toggleRegisterPassword").addEventListener("click", () => {
	const pw = document.getElementById("registerPassword");
	const toggle = document.getElementById("toggleRegisterPassword");
	if (pw.type === "password") {
		pw.type = "text";
		toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>';
	} else {
		pw.type = "password";
		toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">			<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />			<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>';
	}
});

// REGISTER
// rform=document.getElementById("registerForm")
// lform=document.getElementById("loginForm")

rform=registerForm
lform=loginForm
rform.addEventListener("submit", async (e) => {
	e.preventDefault();
	const name = document.getElementById("registerName").value.trim();
	const email = document.getElementById("registerEmail").value.trim();
	const password = document.getElementById("registerPassword").value.trim();

	let valid = true;

	if (name === "") {
		document.getElementById("registerNameError").classList.remove("hidden");
		valid = false;
		} else {
		document.getElementById("registerNameError").classList.add("hidden");
	}

	if (!isEmail(email)) {
		document.getElementById("registerEmailError").classList.remove("hidden");
		valid = false;
		} else {
		document.getElementById("registerEmailError").classList.add("hidden");
	}

	if (password.length < 6) {
	document.getElementById("registerPasswordError").classList.remove("hidden");
		valid = false;
		} else {
		document.getElementById("registerPasswordError").classList.add("hidden");
	}

	if (valid) {
		console.log(name, email, password);
		// registration logic handled below
		// request to API
		const res = await fetch(`${API_BASE}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password, role: "user" })
		});
		// handle response from API
		const data = await res.json();
		if (res.ok) {
			alert("Registered successfully!");
			// optionally: switch to login tab
			//clear the registration fields
			rform.reset()			
			switchForm(registerForm, loginForm,registerTab,loginTab);
		} else {
			alert(data.message || "Registration failed.");
		}
	}
});




// LOGIN
lform.addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("loginEmail").value.trim();
	const password = document.getElementById("loginPassword").value.trim();

	const res = await fetch(`${API_BASE}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	});

	const data = await res.json();
	if (res.ok) {
		alert("Login successful!");
		// store token if returned: localStorage.setItem("token", data.token)
		// redirect if needed
	} else {
		alert(data.message || "Login failed.");
	}
});