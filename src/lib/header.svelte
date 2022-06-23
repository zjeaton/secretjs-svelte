<header>
    <nav class="logo">
        <a sveltekit:prefetch href="/">Home</a>
    </nav>
    <nav class="links">
        <a sveltekit:prefetch href="/query">Queries</a>
        <a sveltekit:prefetch href="/broadcast">Broadcast Tx</a>
        <a sveltekit:prefetch href="/send-sscrt">Send sSCRT</a>
    </nav>
</header>

<style>
    .logo {
        width: 35%;
        padding: .25em 0 0;
        font-size: 1.8em;
    }

    .links {
        width: 55%;
        font-size: 1.25em;
        padding: 0 0 1em;
        display: flex;
        justify-content: space-between;
        margin-top: .3em;
    }

    @media only screen and (max-width: 700px) {
        .logo {
            width: 40%;
        }

        .links {
            width: 60%;
            font-size: 1.25em;
        }
    }
    
    @media only screen and (max-width: 600px) {
        .logo {
            width: 45%;
        }

        .links {
            font-size: 1.2em;
            flex-direction: column;
        }
    }
</style>