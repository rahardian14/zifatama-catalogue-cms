let adminBooksData = []; 

async function loadAdminBooks() {
    try {
        const response = await fetch('api_books.php');
        const data = await response.text(); // Ambil sebagai teks dulu agar bisa di cek
        
        try {
            adminBooksData = JSON.parse(data);
        } catch (e) {
            console.error("Format data dari server bukan JSON yang valid:", data);
            return;
        }

        if (adminBooksData.error) {
            console.error("Error dari server:", adminBooksData.error);
            return;
        }

        const tbody = document.querySelector('#adminBookTable tbody');
        if (!tbody) {
            console.error("Tabel tidak ditemukan!");
            return;
        }
        
        tbody.innerHTML = ''; // Kosongkan tabel sebelum diisi
        
        // Render tiap buku
        adminBooksData.forEach(book => {
            // Logika fallback gambar agar tidak crash kalau gambar kosong
            let imageSrc = "img/404.png"; 
            if (book.image_path && book.image_path.trim() !== '') {
                imageSrc = book.image_path;
            } else if (book.image && Array.isArray(book.image) && book.image.length > 0) {
                imageSrc = book.image[0];
            }

            // Mencegah error jika field data bernilai null
            const title = book.title || 'Tanpa Judul';
            const isbn = book.isbn || '-';
            const category = book.category || '-';
            const harga = book.harga || '0';
            const id = book.id;

            // Logika label status Halaman Depan
            // Pastikan mengecek "1" baik itu sebagai String atau Integer
            const isPop = (book.is_popular == 1 || book.is_popular === "1" || book.is_popular === true);
            const statusBeranda = isPop 
                ? '<span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">⭐ Ya</span>' 
                : '<span style="color: #999; font-size: 14px;">Tidak</span>';

            tbody.innerHTML += `
                <tr>
                    <td style="text-align:center">${id}</td>
                    <td>
                        <img src="${imageSrc}" alt="Cover" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc;">
                    </td>
                    <td>${title}</td>
                    <td>${isbn}</td>
                    <td>${category}</td>
                    <td>${harga}</td>
                    <td style="text-align:center;">${statusBeranda}</td>
                    <td>
                        <button onclick="editBook(${id})" style="background:#f39c12; color:white; border:none; padding:5px 10px; cursor:pointer; margin-right:5px; border-radius: 3px;">Edit</button>
                        <button onclick="deleteBook(${id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius: 3px;">Hapus</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Gagal memuat tabel:", error);
    }
}

function editBook(id) {
    const book = adminBooksData.find(b => b.id == id);
    if (!book) return;

    document.getElementById('bookId').value = book.id || '';
    document.getElementById('title').value = book.title || '';
    document.getElementById('author').value = book.author || '';
    document.getElementById('editor').value = book.editor || '';
    document.getElementById('isbn').value = book.isbn || '';
    document.getElementById('category').value = book.category || '';
    document.getElementById('harga').value = book.harga || '';
    document.getElementById('description').value = book.description || '';
    
    // Centang otomatis jika di DB statusnya 1
    const isPop = (book.is_popular == 1 || book.is_popular === "1" || book.is_popular === true);
    document.getElementById('isPopular').checked = isPop;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('adminBookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('isPopular').checked = false; 
}

document.getElementById('adminBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData();
    const bookId = document.getElementById('bookId').value;
    if (bookId) formData.append('id', bookId);
    
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('editor', document.getElementById('editor').value);
    formData.append('isbn', document.getElementById('isbn').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('harga', document.getElementById('harga').value);
    formData.append('description', document.getElementById('description').value);
    
    // Mengirim status checkbox (true/false) ke PHP
    formData.append('is_popular', document.getElementById('isPopular').checked);
    
    const fileInput = document.getElementById('coverImage');
    if (fileInput.files.length > 0) formData.append('coverImage', fileInput.files[0]);

    const backFileInput = document.getElementById('backCoverImage');
    if (backFileInput.files.length > 0) formData.append('backCoverImage', backFileInput.files[0]);

    try {
        const response = await fetch('proses_admin.php', { method: 'POST', body: formData });
        const result = await response.json();
        if(result.status === 'success') {
            alert(result.message);
            resetForm();
            loadAdminBooks(); 
        } else alert('Gagal: ' + result.message);
    } catch (error) {
        console.error("Gagal menyimpan buku", error);
    }
});

async function deleteBook(id) {
    if (confirm("Yakin ingin menghapus?")) {
        const formData = new FormData();
        formData.append('id', id);
        try {
            const response = await fetch('hapus_buku.php', { method: 'POST', body: formData });
            const result = await response.json();
            if(result.status === 'success') loadAdminBooks();
            else alert('Gagal: ' + result.message);
        } catch (error) {
            console.error("Gagal menghapus:", error);
        }
    }
}

document.addEventListener("DOMContentLoaded", loadAdminBooks);