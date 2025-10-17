<template lang="html">
    <footer class="footer">
        <div class="container-fluid">
            <div class=" text-body-secondary d-flex justify-content-between">
                <div class="text-start">
                    <a class="text-body-secondary" href=" #">
                        Nama Aplikasi © 2024 by IT Adira Finance
                    </a>
                </div>
                <div class="col-lg-6 col-sm-6 text-end text-body-secondary d-none d-md-block">
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item">
                            <a class="text-body-secondary" href="#">V{{ version }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
  data() {
    return {
      version: import.meta.env.VITE_VERSION
    };
  }
};
</script>

<style scoped>
/* tambahkan gaya CSS jika diperlukan */
</style>