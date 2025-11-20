// Menggunakan localStorage untuk menyimpan status progress
let currentModule = 0;
// Muatkan progress yang disimpan atau gunakan nilai lalai (0%)
let progress = JSON.parse(localStorage.getItem("progress")) || {
    1: 0,
    2: 0,
    3: 0
};

// Data kandungan modul dan kuiz
const modules = {
    1: {
        title: "Asas Komputer",
        content: "Pengenalan kepada komputer, hardware, software dan fungsinya. Modul ini adalah langkah pertama untuk memahami dunia digital.",
        quiz: [
            { q: "Apakah CPU?", a: "Otak komputer" },
            { q: "Apakah RAM digunakan untuk?", a: "Menyimpan data sementara" }
        ]
    },
    2: {
        title: "Asas Rangkaian",
        content: "Belajar IP address, router, switch dan konsep rangkaian. Ini penting untuk memahami bagaimana internet berfungsi.",
        quiz: [
            { q: "Apa maksud IP?", a: "Internet Protocol" },
            { q: "Router digunakan untuk?", a: "Menghubung rangkaian" }
        ]
    },
    3: {
        title: "Microsoft Office",
        content: "Belajar Word, Excel dan PowerPoint asas. Kemahiran ini penting dalam persekitaran pejabat moden.",
        quiz: [
            { q: "Apakah fungsi Excel?", a: "Kira dan analisis data" }
        ]
    }
};

// Fungsi untuk mengawal paparan halaman
function showPage(id) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Tunjukkan halaman yang dikehendaki
    document.getElementById(id).classList.add('active');
}

// Fungsi Log Masuk
function login() {
    // Guna kaedah ringkas untuk mengelakkan penggunaan 'alert()'
    const messageBox = (msg) => {
        document.querySelector('.card').insertAdjacentHTML('beforeend', `<p id="login-msg" style="color:red; margin-top:10px;">${msg}</p>`);
        setTimeout(() => document.getElementById('login-msg')?.remove(), 3000);
    }
    
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === "admin" && p === "1234") {
        showPage("dashboard");
        updateProgress();
    } else {
        messageBox("Salah! Nama pengguna atau kata laluan tidak sah.");
    }
}

// Fungsi Log Keluar
function logout() {
    showPage("loginPage");
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
}

// Fungsi membuka halaman modul
function openModule(num) {
    currentModule = num;
    document.getElementById("moduleTitle").innerText = modules[num].title;
    document.getElementById("moduleContent").innerText = modules[num].content;
    
    // Kemaskini status butang Tandakan Selesai (Jika 100% sudah dicapai, disable)
    const completeBtn = document.querySelector('#modulePage button:first-of-type');
    if (progress[num] === 100) {
        completeBtn.innerText = "Modul Selesai (100%)";
        completeBtn.disabled = true;
        completeBtn.style.backgroundColor = '#6c757d';
    } else {
        completeBtn.innerText = "Tandakan Selesai";
        completeBtn.disabled = false;
        completeBtn.style.backgroundColor = '#007bff';
    }

    showPage("modulePage");
}

function goBack() { showPage("dashboard"); }

// Fungsi menandakan modul selesai
function completeLesson() {
    progress[currentModule] = 100;
    localStorage.setItem("progress", JSON.stringify(progress));
    
    // Tunjukkan notifikasi ringkas
    const msg = document.createElement('div');
    msg.innerText = `Tahniah! Modul ${modules[currentModule].title} selesai.`;
    msg.style.cssText = 'position:fixed; top:20px; right:20px; background:#28a745; color:white; padding:10px 20px; border-radius:5px; z-index:1000;';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    // Disable butang dan kemaskini paparan
    document.querySelector('#modulePage button:first-of-type').innerText = "Modul Selesai (100%)";
    document.querySelector('#modulePage button:first-of-type').disabled = true;
    document.querySelector('#modulePage button:first-of-type').style.backgroundColor = '#6c757d';
    
    updateProgress();
}

// Fungsi mengemaskini paparan progress bar
function updateProgress() {
    for (let i = 1; i <= 3; i++) {
        const progressBar = document.getElementById(`progress${i}`);
        if (progressBar) {
            // Menggunakan CSS Variable untuk mengemaskini lebar progress bar
            progressBar.style.setProperty('--progress-width', `${progress[i]}%`);
        }
    }
}

// Fungsi membuka Kuiz
function openQuiz() {
    const q = modules[currentModule].quiz;
    document.getElementById("quizTitle").innerText = "Kuiz " + modules[currentModule].title;

    let html = "";
    q.forEach((item, i) => {
        html += `<div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
            <p style="margin: 0 0 5px 0;"><b>Soalan ${i + 1}:</b> ${item.q}</p>
            <input id="q${i}" placeholder="Taip jawapan anda di sini">
        </div>`;
    });

    document.getElementById("quizBox").innerHTML = html;
    showPage("quizPage");
}

function closeQuiz() { showPage("modulePage"); }

// Fungsi menghantar jawapan kuiz
function submitQuiz() {
    const q = modules[currentModule].quiz;
    let score = 0;

    q.forEach((item, i) => {
        // Bandingkan jawapan tanpa mengira huruf besar/kecil
        let ans = document.getElementById(`q${i}`).value.trim().toLowerCase(); 
        if (ans === item.a.toLowerCase()) {
            score++;
            document.getElementById(`q${i}`).style.borderColor = 'green';
        } else {
            document.getElementById(`q${i}`).style.borderColor = 'red';
        }
    });

    // Tunjukkan markah
    const msg = document.createElement('div');
    msg.innerText = `Markah Kuiz Anda: ${score} / ${q.length}.`;
    msg.style.cssText = 'position:fixed; top:20px; right:20px; background:#007bff; color:white; padding:10px 20px; border-radius:5px; z-index:1000;';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
}

// Apabila laman dimuatkan, cuba kemaskini progress
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});