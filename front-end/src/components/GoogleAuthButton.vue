<template>
  <div id="google-signup-btn" 
   style="width:100%;display:flex;justify-content:center;"></div>
</template>

<script>
export default {
  name: 'GoogleAuthButton',
  mounted() {
    // Inject Google Identity Services script if not present
    if (!window.google || !window.google.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = this.renderGoogleButton;
      document.head.appendChild(script);
    } else {
      this.renderGoogleButton();
    }
  },
  methods: {
    renderGoogleButton() {
      if (window.google && window.google.accounts && document.getElementById('google-signup-btn')) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: this.onGoogleSignIn
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { theme: 'outline', size: 'large', text: 'signup_with', width: 340 }
        );
      }
    },
    onGoogleSignIn(response) {
      // Parse JWT to get user info (optional)
      const credential = response.credential;
      // Decode JWT (optional):
      // const payload = JSON.parse(atob(credential.split('.')[1]));
      // alert(JSON.stringify(payload));
      this.$emit('success', credential);
    }
  }
}
</script>
<style scoped>
.btn-google {
  width: 100%;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: border-color 0.3s ease;
  margin-bottom: 30px;
}

.btn-google:hover {
  border-color: #91a2eb;
  color: #91a2eb;
}
</style>
