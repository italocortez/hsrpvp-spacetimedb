<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto px-4 py-8">
    
    <!-- Create Lobby Card -->
    <router-link
      :to="{ name: 'lobby' }"
      class="group relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-750 hover:border-blue-500 overflow-hidden cursor-pointer h-64"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
      <img
        src="@/assets/features/create_lobby.png"
        alt="Create Lobby"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        @error="handle_image_error"
      />
      <div class="relative z-10 mt-auto text-center bg-gray-900/80 w-full py-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <h3 class="text-xl font-bold text-white tracking-wide">Create Lobby</h3>
        <p class="text-sm text-gray-300 mt-1">Host and manage your matches</p>
      </div>
    </router-link>

    <!-- Data Library Card -->
    <router-link
      :to="{ name: 'library' }"
      class="group relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-750 hover:border-purple-500 overflow-hidden cursor-pointer h-64"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
      <img
        src="@/assets/features/cost_tables.png"
        alt="Data Library"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        @error="handle_image_error"
      />
      <div class="relative z-10 mt-auto text-center bg-gray-900/80 w-full py-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <h3 class="text-xl font-bold text-white tracking-wide">Data Library</h3>
        <p class="text-sm text-gray-300 mt-1">Explore char costs & stats</p>
      </div>
    </router-link>

    <!-- Team Builder Card -->
    <router-link
      :to="{ name: 'builder' }"
      class="group relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-750 hover:border-emerald-500 overflow-hidden cursor-pointer h-64"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
      <img
        src="@/assets/features/testing_sandbox.png"
        alt="Team Builder"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        @error="handle_image_error"
      />
      <div class="relative z-10 mt-auto text-center bg-gray-900/80 w-full py-3 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <h3 class="text-xl font-bold text-white tracking-wide">Team Builder</h3>
        <p class="text-sm text-gray-300 mt-1">Draft and test combinations</p>
      </div>
    </router-link>

  </div>
</template>

<script setup lang="ts">
// Fallback for missing images since the user just mentioned the files
// This prevents ugly broken image icons if they aren't actually placed yet.
const handle_image_error = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
};
</script>
