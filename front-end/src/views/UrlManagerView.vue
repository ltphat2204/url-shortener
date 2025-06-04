<template>
  <div class="url-manager-view">
    <!-- App Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="main-content">
      <UrlManagerTable
        @url-added="handleUrlAdded"
        @url-updated="handleUrlUpdated"
        @url-deleted="handleUrlDeleted"
      />
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import UrlManagerTable from '@/components/UrlManagerTable.vue'

// Event handlers
const handleUrlAdded = (url) => {
  console.log('URL đã được thêm:', url)
  // Có thể thêm logic khác như gửi analytics, notification, etc.
}

const handleUrlUpdated = (url) => {
  console.log('URL đã được cập nhật:', url)
  // Có thể thêm logic khác
}

const handleUrlDeleted = (url) => {
  console.log('URL đã được xóa:', url)
  // Có thể thêm logic khác
}
</script>

<style scoped>
.url-manager-view {
  padding-top: 70px; /* Add padding to avoid header overlap */
}

.main-content {
  min-height: calc(100vh - 70px);
}

.url-manager-main {
  width: 100vw;
  min-height: 100vh;
  background: #f6f8fa;
  padding: 40px 0 0 0;
}
.url-manager-header {
  max-width: 900px;
  margin: 0 auto 24px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.url-manager-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}
.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-add:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b47b6 100%);
  transform: translateY(-2px);
}
.url-table-wrapper {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 24px;
}
.url-table {
  width: 100%;
  border-collapse: collapse;
}
.url-table th, .url-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 15px;
}
.url-table th {
  background: #f6f8fa;
  font-weight: 700;
  color: #333;
}
.url-table tr:last-child td {
  border-bottom: none;
}
.url-table a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}
.url-table a:hover {
  text-decoration: underline;
}
.original-url {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: black;
}
.btn-action {
  background: #f3f4f6;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-action:hover {
  background: #e5e7eb;
}
.btn-danger {
  background: #fee2e2;
  color: #b91c1c;
}
.btn-danger:hover {
  background: #fecaca;
}
.modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.modal-content h2 {
  margin-bottom: 18px;
  font-size: 1.3rem;
  color: #333;
}
.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e1e5e9;
  border-radius: 7px;
  font-size: 15px;
  transition: border-color 0.2s;
  color: black;
}
.form-group input:focus {
  outline: none;
  border-color: #667eea;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 18px;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b47b6 100%);
  transform: translateY(-2px);
}
.btn-cancel {
  background: #f3f4f6;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: #e5e7eb;
}
</style>
