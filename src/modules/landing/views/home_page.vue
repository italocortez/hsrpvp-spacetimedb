<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center">
    
    <!-- Hero / Welcome Section -->
    <header class="w-full py-16 text-center mt-10">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
        Welcome to IPC PvP Program
      </h1>
      <p class="text-lg text-gray-400 max-w-2xl mx-auto px-4 mb-10">
        Enter the arena, analyze the data, and build the ultimate team. Authenticate below to begin your session.
      </p>
      
      <!-- Login Form Component -->
      <div class="flex justify-center w-full px-4">
        <LoginForm 
          @login:guest="on_login_guest"
          @login:discord="on_login_discord"
        />
      </div>
    </header>

    <!-- Features Section (Below the fold) -->
    <section class="w-full py-12 mt-10 border-t border-gray-800 bg-gray-900/50">
      <div class="max-w-6xl mx-auto px-4 text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-200">Platform Features</h2>
      </div>
      
      <!-- Feature Cards Component -->
      <FeatureCards />
    </section>
    
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/modules/auth/components/login_form.vue';
import FeatureCards from '@/modules/landing/components/feature_cards.vue';

const on_login_guest = (alias: string) => {
  console.log(`[Home] Guest login initiated for alias: ${alias}`);
  // Future SpacetimeDB integration logic would go here
};

const on_login_discord = () => {
  console.log(`[Home] Discord login initiated`);
  // Future SpacetimeDB integration logic would go here
};
</script>
