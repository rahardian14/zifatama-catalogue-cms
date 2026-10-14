// --- DEKLARASI VARIABEL GLOBAL ---
let books = []; 

// --- FUNGSI UTAMA PENGAMBIL DATA DARI DATABASE ---
async function fetchBooksFromDB() {
    try {
        const response = await fetch('api_books.php');
        books = await response.json(); 
        
        if (books.error) {
            console.error("Error DB:", books.error);
            return;
        }
        
        // Setelah data sukses diambil, jalankan logika halaman
        initPageLogic(); 
        
    } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooksFromDB();

    // Tambahkan deteksi tombol "Enter" pada kolom pencarian
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Mencegah reload halaman bawaan browser
                
                // Jika sedang di halaman kategori, gunakan live filter
                if (window.location.pathname.includes('kategori.html')) {
                    searchBooksOnPage();
                } else {
                    // Jika di halaman index, lempar ke halaman kategori
                    redirectToSearchPage();
                }
            }
        });
    }
});

// --- FUNGSI PENGATUR HALAMAN ---
function initPageLogic() {
    populateCategoryDropdown();

    // Logika Dropdown Hover
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    let closeTimer;

    if (dropdown && dropdownContent) {
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
            dropdownContent.style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', () => {
            closeTimer = setTimeout(() => {
                dropdownContent.style.display = 'none';
            }, 100); 
        });
    }

    const path = window.location.pathname;

    // 1. LOGIKA HALAMAN INDEX (BERANDA)
    if (path.endsWith('index.html') || path === '/' || path.endsWith('zifatama.co.id/')) {
        const popularBooks = books.filter(book => book.is_popular == 1); 
        if (popularBooks.length === 0) {
            displayBooks(books.slice(0, 8), 'popular-book-list');
        } else {
            displayBooks(popularBooks, 'popular-book-list');
        }
        
        if (typeof articles !== 'undefined') {
            displayArticles(articles, 'article-list'); 
        }
    }

    // 2. LOGIKA HALAMAN KATEGORI / PENCARIAN
    if (path.includes('kategori.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        const categoryQuery = urlParams.get('category');
        
        let booksToDisplay = books; 

        if (searchQuery) {
            document.getElementById('searchInput').value = searchQuery;
            const searchTerm = searchQuery.toLowerCase();
            
            // Tambahkan pengaman (|| "") sama seperti fungsi searchBooksOnPage
            booksToDisplay = books.filter(book => {
                const titleMatch = (book.title || "").toLowerCase().includes(searchTerm);
                const categoryMatch = (book.category || "").toLowerCase().includes(searchTerm);
                const isbnMatch = (book.isbn || "").toLowerCase().includes(searchTerm);
                
                return titleMatch || categoryMatch || isbnMatch;
            });
        } else if (categoryQuery) {
            booksToDisplay = books.filter(book => book.category === categoryQuery);
        }
        displayBooks(booksToDisplay, 'book-list');
    }
    
    // 3. LOGIKA HALAMAN DETAIL BUKU
    if (path.includes('detail.html')) {
        displayBookDetail();
    }

    // 4. LOGIKA HALAMAN DETAIL ARTIKEL
    if (path.includes('artikel.html') && document.getElementById('article-detail-content')) {
        displayArticleDetail();
    }
}

// --- FUNGSI RENDER UMUM ---

function displayBooks(bookList, containerId) {
    const bookListContainer = document.getElementById(containerId);
    const notFoundMessage = document.getElementById('not-found');

    if (!bookListContainer) return; 
    bookListContainer.innerHTML = '';

    if (!bookList || bookList.length === 0) {
        if (notFoundMessage) notFoundMessage.style.display = 'block';
    } else {
        if (notFoundMessage) notFoundMessage.style.display = 'none';
        bookList.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            
            // Logika Fallback Gambar
            let imageSrc = "img/placeholder.png";
            if (book.image_path && book.image_path.trim() !== '') {
                imageSrc = book.image_path;
            } else if (book.image && Array.isArray(book.image) && book.image.length > 0) {
                imageSrc = book.image[0];
            }

            bookItem.innerHTML = `
                <img src="${imageSrc}" alt="${book.title}"> 
                <h3>${book.title}</h3>
                <p>Kategori:<strong> ${book.category}</strong></p>
                <h4>${book.harga}</h4>
                <a href="detail.html?id=${book.id}" class="detail-button">Lihat Detail</a>
            `;
            bookListContainer.appendChild(bookItem);
        });
    }
}

function displayArticles(articleList, containerId) {
    const articleListContainer = document.getElementById(containerId);
    if (!articleListContainer) return;
    articleListContainer.innerHTML = '';

    if (articleList && articleList.length > 0) {
        articleList.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item'; 
            articleItem.innerHTML = `
                <img src="${article.image}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>Penulis: ${article.author} | Tanggal: ${article.date}</p>
                <p>${article.excerpt}</p>
                <a href="artikel.html?id=${article.id}" class="read-more-button">Baca Selengkapnya</a>
            `;
            articleListContainer.appendChild(articleItem);
        });
    }
}

function populateCategoryDropdown() {
    const dropdownMenu = document.getElementById('category-dropdown-menu');
    if (!dropdownMenu) return;

    const categories = [...new Set(books.map(book => book.category))];
    dropdownMenu.innerHTML = '';

    const allItem = document.createElement('li');
    allItem.innerHTML = `<a href="kategori.html">Semua Kategori</a>`;
    dropdownMenu.appendChild(allItem);

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="kategori.html?category=${encodeURIComponent(category)}">${category}</a>`;
        dropdownMenu.appendChild(listItem);
    });
}

function searchBooksOnPage() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    // Gunakan (book.property || "") agar tidak error jika data di database kosong/null
    const filteredBooks = books.filter(book => {
        const titleMatch = (book.title || "").toLowerCase().includes(searchTerm);
        const categoryMatch = (book.category || "").toLowerCase().includes(searchTerm);
        const isbnMatch = (book.isbn || "").toLowerCase().includes(searchTerm);

        return titleMatch || categoryMatch || isbnMatch;
    });

    displayBooks(filteredBooks, 'book-list');

    // Opsional: Perbarui URL parameter di address bar tanpa me-reload halaman
    if (searchTerm !== '') {
        const newUrl = window.location.pathname + "?q=" + encodeURIComponent(searchTerm);
        window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
        const newUrl = window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
}

function redirectToSearchPage() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.trim();
    // Arahkan ke halaman kategori beserta query pencariannya
    window.location.href = `kategori.html?q=${encodeURIComponent(searchTerm)}`;
}

// --- FUNGSI RENDER HALAMAN DETAIL BUKU (DENGAN COVER BELAKANG) ---

function displayBookDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id'); 
    const detailContainer = document.getElementById('book-detail-content');

    if (!detailContainer) return;

    if (!bookId) {
        detailContainer.innerHTML = `<p style="text-align:center; padding:50px;">Error: ID buku tidak ditemukan.</p>`;
        return;
    }

    // Konversi ke string agar pasti cocok
    const book = books.find(b => String(b.id) === String(bookId)); 

    if (book) {
        let mainImage = "img/placeholder.png"; 
        let galleryHtml = '<div class="gallery-wrapper" style="text-align:center;">';
        
        // Tentukan gambar utama
        if (book.image_path && book.image_path.trim() !== '') {
            mainImage = book.image_path;
        } else if (book.image && Array.isArray(book.image) && book.image.length > 0) {
            mainImage = book.image[0];
        }

        // Tampilkan gambar utama
        galleryHtml += `<img id="main-preview-img" src="${mainImage}" alt="${book.title}" class="main-preview" style="max-width:100%; border-radius: 8px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">`;
        
        // Logika Thumbnail (Mendukung Cover Belakang MySQL atau Array JSON lama)
        let thumbnails = [];
        if (book.image_path && book.image_path.trim() !== '') thumbnails.push(book.image_path);
        if (book.image_path_back && book.image_path_back.trim() !== '') thumbnails.push(book.image_path_back);
        
        // Jika tidak ada cover dari DB, coba dari format JS lama
        if (thumbnails.length === 0 && book.image && Array.isArray(book.image) && book.image.length > 1) {
            thumbnails = book.image;
        }

        // Jika ada lebih dari 1 gambar, tampilkan deretan thumbnail kecil
        if (thumbnails.length > 1) {
            galleryHtml += '<div class="thumbnail-row" style="display:flex; gap:10px; margin-top:15px; justify-content:center;">';
            thumbnails.forEach(imgSrc => {
                if (imgSrc) {
                    galleryHtml += `<img src="${imgSrc}" class="thumbnail" onclick="document.getElementById('main-preview-img').src='${imgSrc}'" style="width:70px; height:100px; object-fit:cover; cursor:pointer; border-radius:4px; border:2px solid #ddd; transition: 0.3s;">`;
                }
            });
            galleryHtml += '</div>';
        }
        
        galleryHtml += '</div>';

        // Olah teks author dan editor
        const authorDisplay = Array.isArray(book.author) ? book.author.join(", ") : (book.author || "-");
        const editorHtml = (book.editor && book.editor.trim() !== '') 
            ? `<p><strong>Editor:</strong> ${Array.isArray(book.editor) ? book.editor.join(", ") : book.editor}</p>` 
            : '';

        const isbnText = book.isbn || "-";
        const sizeText = book.size ? `<p><strong>Ukuran Buku:</strong></p><p>${book.size}</p>` : '';
        const rentalUrl = `https://www.zifatamadigital.com/buku_list.php?q=${encodeURIComponent(book.title)}`;

        // Cetak ke layar
        detailContainer.innerHTML = `
            ${galleryHtml}
            
            <div class="book-info">
                <h2 style="font-size: 24px; margin-bottom: 10px;">${book.title}</h2>
                <p class="isbn" style="color:#666; font-size:14px;">ISBN: ${isbnText}</p>
                <p><strong>Penulis:</strong> ${authorDisplay}</p>
                ${editorHtml} 
                <p><strong>Kategori:</strong> ${book.category}</p>
                <p><strong>Deskripsi:</strong></p>
                <p style="white-space: pre-wrap; line-height: 1.6;">${book.description}</p>
                
                ${sizeText}
                
                <h3 style="color:#007bff; font-size: 22px; margin-top:20px;">${book.harga}</h3>
                
                <div class="button-group" style="display:flex; gap:15px; margin-top:25px;">
                    <a id="buy-button" class="whatsapp-button" style="background:#25D366; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;" href="https://api.whatsapp.com/send?phone=6281235485066&text=Halo,%20saya%20ingin%20membeli%20buku%20${encodeURIComponent(book.title)}">Beli via WhatsApp (admin 1)</a>
                    <a id="buy-button" class="whatsapp-button" style="background:#25D366; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;" href="https://api.whatsapp.com/send?phone=6289502588942&text=Halo,%20saya%20ingin%20membeli%20buku%20${encodeURIComponent(book.title)}">Beli via WhatsApp (admin 2)</a>
                    <a id="rental-button" class="rental-button" style="background:#007bff; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;" href="${rentalUrl}" target="_blank">Sewa Buku Ini</a>
                </div>
            </div>
        `;

    } else {
        detailContainer.innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h3>Buku tidak ditemukan!</h3>
                <p>Buku mungkin sudah dihapus dari sistem atau link tidak valid.</p>
                <br>
                <a href="index.html" style="background:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">Kembali ke Beranda</a>
            </div>
        `;
    }
}

function displayArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    // Asumsi array articles ada jika dataartikel.js di-load
    if(typeof articles === 'undefined') return;
    
    const article = articles.find(a => a.id === articleId);
    const detailContainer = document.getElementById('article-detail-content');
    
    if (article) {
        detailContainer.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="article-detail-image" style="max-width:100%; border-radius:8px;">
            <h2>${article.title}</h2>
            <p class="article-meta" style="color:#666; font-size:14px;">Penulis: ${article.author} | Tanggal: ${article.date}</p>
            <div class="article-full-content" style="margin-top:20px; line-height:1.6;">
                ${article.fullContent}
            </div>
            <a href="index.html" style="display:inline-block; margin-top:20px; color:#007bff; text-decoration:none; font-weight:bold;">&larr; Kembali</a>
        `;
    } else {
        detailContainer.innerHTML = `<p style="text-align:center;">Artikel tidak ditemukan.</p>`;
    }
}