<template>
  <div class="landing_page">
    <!-- Hero Section -->
    <section class="welcome_section">
      <div class="welcome_content">
        <h1 class="welcome_title">IPC PvP Program</h1>
        <p class="welcome_subtitle">
          Drafting interface for Honkai Star Rail PvP matches
        </p>

        <!-- Login Form Component -->
        <div class="auth_wrapper">
          <LoginForm 
            @login:guest="on_login_guest"
            @login:discord="on_login_discord"
          />
        </div>
        
        <!-- Feature Cards Component -->
        <div class="features_wrapper">
          <FeatureCards />
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact_section" class="contact_section">
      <div class="contact_content">
        <h2>Contact Us</h2>
        <p class="contact_intro">
          Developed by Nathyron for 'The Genius Society' community.
        </p>
        
        <div class="contact_methods">
          <a
            href="https://discord.com/invite/HbXErzYVQ5"
            target="_blank"
            rel="noopener noreferrer"
            class="contact_btn discord_btn"
          >
            <svg class="icon_svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord
          </a>

          <div class="contact_row">
            <code class="username_code">nathyron</code>
            <button @click="handle_copy_username" class="copy_btn">
              <span v-if="!copied">Copy</span>
              <span v-else>Copied!</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '../../auth/components/login_form.vue';
import FeatureCards from '../components/feature_cards.vue';

const copied = ref(false);

const handle_copy_username = async () => {
  try {
    await navigator.clipboard.writeText("nathyron");
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = "nathyron";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
};

const on_login_guest = (alias: string) => {
  console.log(`[Home] Guest login initiated for alias: ${alias}`);
};

const on_login_discord = () => {
  console.log(`[Home] Discord login initiated`);
};
</script>

<style scoped>
/* Layout */
.landing_page {
  min-height: 100vh;
  width: 100%;
  background-color: rgb(17, 24, 39);
  color: #fff;
  font-family: 'Inter', sans-serif;
}

/* Hero Section */
.welcome_section {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at center, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%);
}

.welcome_content {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.welcome_title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome_subtitle {
  font-size: 1.25rem;
  color: rgb(156, 163, 175);
  margin-bottom: 2.5rem;
}

.auth_wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 4rem;
}

.features_wrapper {
  width: 100%;
  margin-top: 2rem;
}

/* Footer / Contact */
.contact_section {
  padding: 2rem;
  border-top: 1px solid rgb(31, 41, 55);
  background: rgb(17, 24, 39);
  text-align: center;
}

.contact_content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.contact_intro {
  color: rgb(107, 114, 128);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.contact_methods {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.contact_btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s;
}

.discord_btn {
  background: #5865F2;
  color: white;
}

.discord_btn:hover {
  background: #4752c4;
}

.contact_row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(31, 41, 55);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(55, 65, 81);
}

.username_code {
  color: rgb(34, 197, 94);
  font-family: monospace;
  font-size: 0.9rem;
}

.copy_btn {
  background: transparent;
  border: none;
  color: rgb(156, 163, 175);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.copy_btn:hover {
  color: white;
}

.icon_svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>