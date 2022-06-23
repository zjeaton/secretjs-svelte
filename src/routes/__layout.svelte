<script>
    import Header from '$lib/header.svelte';
    // import Footer from '$lib/footer.svelte';
</script>

<Header />

<slot />

<script context="module">
    import '../../src/css/style.css';
</script>