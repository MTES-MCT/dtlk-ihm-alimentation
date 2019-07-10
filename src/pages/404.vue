<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="statics/angry.png"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Désolé, il n'y a rien ici....<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="$router.push({ name: 'login' })"
    >Retour à l'accueil</q-btn>
  </div>
</template>
