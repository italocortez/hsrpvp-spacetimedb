<template>
  <div class="login_container">
    <!-- Guest Login Section -->
    <div class="guest_section">
      <label for="guest_alias" class="label_text">Guest Access</label>
      <div class="input_row">
        <input
          id="guest_alias"
          v-model="guest_alias"
          type="text"
          placeholder="Enter alias..."
          class="input_field"
          @keyup.enter="handle_guest_login"
        />
        <button
          @click="handle_guest_login"
          :disabled="!guest_alias.trim()"
          class="btn_guest"
        >
          Join
        </button>
      </div>
    </div>

    <!-- Separator -->
    <div class="separator">
      <div class="line"></div>
      <span class="or_text">OR</span>
      <div class="line"></div>
    </div>

    <!-- Discord Login Section -->
    <button @click="handle_discord_login" class="btn_discord">
      <svg class="discord_icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
      Login with Discord
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const guest_alias = ref('');

const emit = defineEmits<{
  (e: 'login:guest', alias: string): void;
  (e: 'login:discord'): void;
}>();

const handle_guest_login = () => {
  if (guest_alias.value.trim()) {
    emit('login:guest', guest_alias.value.trim());
  }
};

const handle_discord_login = () => {
  emit('login:discord');
};
</script>

<style scoped>
.login_container {
  width: 100%;
  max-width: 400px;
  background-color: rgb(31, 41, 55); /* Gray 800 */
  border: 1px solid rgb(55, 65, 81); /* Gray 700 */
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Guest Section */
.guest_section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label_text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219); /* Gray 300 */
  text-align: left;
}

.input_row {
  display: flex;
  gap: 0.5rem;
}

.input_field {
  flex: 1;
  background-color: rgb(55, 65, 81); /* Gray 700 */
  border: 1px solid rgb(75, 85, 99); /* Gray 600 */
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.input_field:focus {
  border-color: rgb(59, 130, 246); /* Blue 500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input_field::placeholder {
  color: rgb(156, 163, 175);
}

.btn_guest {
  padding: 0.5rem 1rem;
  background-color: rgb(37, 99, 235); /* Blue 600 */
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn_guest:hover:not(:disabled) {
  background-color: rgb(29, 78, 216); /* Blue 700 */
}

.btn_guest:disabled {
  background-color: rgb(75, 85, 99);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Separator */
.separator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.line {
  flex: 1;
  height: 1px;
  background-color: rgb(75, 85, 99); /* Gray 600 */
}

.or_text {
  font-size: 0.875rem;
  color: rgb(156, 163, 175); /* Gray 400 */
}

/* Discord Button */
.btn_discord {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem;
  background-color: #5865F2; /* Discord Blurple */
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn_discord:hover {
  background-color: #4752C4;
}

.discord_icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>