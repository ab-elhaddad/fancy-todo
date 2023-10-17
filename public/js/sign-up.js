function matchPassword() {
	const password = document.getElementById("u_password").value;
	const password_confirm = document.getElementById("u_password_confirm").value;
	if (password !== password_confirm)
		alert("Password doesn't match!");
	return password === password_confirm;
}
