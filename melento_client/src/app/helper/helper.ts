export function checkLogin() { 
  console.log("Function called");
  let role = localStorage.getItem('role');
  if (role === 'null') {
    return false;
  }
  return true;
}
