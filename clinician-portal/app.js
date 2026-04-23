fetch("https://yourdomain.com/api/patients")
.then(res=>res.json())
.then(data=>{
document.getElementById("patients").innerHTML =
data.map(p=>`<p>${p.name} - Avg BP: ${p.avg}</p>`).join("");
});
