<template>
  <div class="cards_container">
    
    <!-- Create Lobby Card -->
    <router-link :to="{ name: 'lobby' }" class="feature_card">
      <div class="card_image_wrapper">
        <img :src="img_create_lobby" alt="Create Lobby" class="card_image" />
      </div>
      <div class="card_content">
        <h3>Create Lobby</h3>
        <p>Host matches and manage live draft sessions. To host a lobby, you must be logged in.</p>
      </div>
    </router-link>

    <!-- Team Builder Card -->
    <router-link :to="{ name: 'builder' }" class="feature_card">
      <div class="card_image_wrapper">
        <img :src="img_testing_sandbox" alt="Team Builder" class="card_image" />
      </div>
      <div class="card_content">
        <h3>Team Builder</h3>
        <p>Experiment with loadouts and test compositions, saving up to 3 teams at once per draft mode</p>
      </div>
    </router-link>

    <!-- Data Library Card -->
    <router-link :to="{ name: 'library' }" class="feature_card">
      <div class="card_image_wrapper">
        <img :src="img_cost_tables" alt="Data Library" class="card_image" />
      </div>
      <div class="card_content">
        <h3>Cost Tables</h3>
        <p>Check Characters and Lightcone Costs for each draft and game mode</p>
      </div>
    </router-link>

  </div>
</template>

<script setup lang="ts">
// Import Assets explicitly for Vite bundling
import img_create_lobby from '../../../assets/features/create_lobby.png';
import img_cost_tables from '../../../assets/features/cost_tables.png';
import img_testing_sandbox from '../../../assets/features/testing_sandbox.png';
</script>

<style scoped>
.cards_container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.feature_card {
  display: flex;
  flex-direction: column;
  background-color: rgb(31, 41, 55); /* Gray 800 */
  border: 1px solid rgb(55, 65, 81); /* Gray 700 */
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  min-height: 320px;
}

.feature_card:hover {
  transform: translateY(-6px);
  border-color: rgb(75, 85, 99);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

/* Image Handling */
.card_image_wrapper {
  flex: 1;
  width: 100%;
  background: radial-gradient(circle, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.card_image {
  width: 100%;
  height: 100%;
  max-height: 180px;
  object-fit: contain;
  /* CRITICAL FIX: Inverts black lines to white for dark mode visibility */
  filter: invert(1) opacity(0.85);
  transition: transform 0.4s ease, opacity 0.3s;
}

.feature_card:hover .card_image {
  transform: scale(1.08);
  opacity: 1;
}

/* Text Content */
.card_content {
  padding: 1.5rem;
  background-color: rgb(31, 41, 55);
  border-top: 1px solid rgb(55, 65, 81);
  z-index: 2;
}

.card_content h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
}

.card_content p {
  color: rgb(156, 163, 175); /* Gray 400 */
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}
</style>