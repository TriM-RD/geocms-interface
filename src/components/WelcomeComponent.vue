<template>
  <nav class="navbar navbar-light bg-light static-top">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="../assets/LogoTriM.png" alt="Logo" width="85" class="d-inline-block align-text-top">
      </a>
      <button v-on:click="login()" class="btn btn-outline-secondary">Login</button>
    </div>
  </nav>
  <!-- Masthead-->
  <header class="masthead">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-6">
          <div class="text-center text-white">
            <!-- Page heading-->
            <h1 class="mb-5">Generate more leads with a professional landing page!</h1>
            <!-- Signup form-->
            <!-- * * * * * * * * * * * * * * *-->
            <!-- * * SB Forms Contact Form * *-->
            <!-- * * * * * * * * * * * * * * *-->
            <!-- This form is pre-integrated with SB Forms.-->
            <!-- To make this form functional, sign up at-->
            <!-- https://startbootstrap.com/solution/contact-forms-->
            <!-- to get an API token!-->
            <form class="form-subscribe" id="contactForm" data-sb-form-api-token="API_TOKEN">
              <!-- Email address input-->
              <div class="row">
                <div class="col">
                  <input class="form-control form-control-lg" id="emailAddress" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                  <div class="invalid-feedback text-white" data-sb-feedback="emailAddress:required">Email Address is required.</div>
                  <div class="invalid-feedback text-white" data-sb-feedback="emailAddress:email">Email Address Email is not valid.</div>
                </div>
                <div class="col-auto"><button class="btn btn-secondary btn-lg " id="submitButton" type="submit">Submit</button></div>
              </div>
              <!-- Submit success message-->
              <!---->
              <!-- This is what your users will see when the form-->
              <!-- has successfully submitted-->
              <div class="d-none" id="submitSuccessMessage">
                <div class="text-center mb-3">
                  <div class="fw-bolder">Form submission successful!</div>
                  <p>To activate this form, sign up at</p>
                  <a class="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                </div>
              </div>
              <!-- Submit error message-->
              <!---->
              <!-- This is what your users will see when there is-->
              <!-- an error submitting the form-->
              <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- Icons Grid-->
  <section class="features-icons bg-light text-center">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-window m-auto text-secondary"></i></div>
            <h3>Fully Responsive</h3>
            <p class="lead mb-0">This theme will look great on any device, no matter the size!</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-layers m-auto text-secondary"></i></div>
            <h3>Bootstrap 5 Ready</h3>
            <p class="lead mb-0">Featuring the latest build of the new Bootstrap 5 framework!</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-terminal m-auto text-secondary"></i></div>
            <h3>Easy to Use</h3>
            <p class="lead mb-0">Ready to use with your own content, or customize the source files!</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Image Showcases-->
  <section class="showcase">
    <div class="container-fluid p-0">
      <div class="row g-0">
        <div class="col-lg-6 order-lg-2 text-white showcase-img">
          <img class="img-fluid" src="../assets/bg-showcase-1.jpg" alt="..." />
        </div>
        <div class="col-lg-6 order-lg-1 my-auto showcase-text">
          <h2>Fully Responsive Design</h2>
          <p class="lead mb-0">When you use a theme created by Start Bootstrap, you know that the theme will look great on any device, whether it's a phone, tablet, or desktop the page will behave responsively!</p>
        </div>
      </div>
      <div class="row g-0">
        <div class="col-lg-6 text-white showcase-img">
          <img class="img-fluid" src="../assets/bg-showcase-2.jpg" alt="..." />
        </div>
        <div class="col-lg-6 my-auto showcase-text">
          <h2>Updated For Bootstrap 5</h2>
          <p class="lead mb-0">Newly improved, and full of great utility classes, Bootstrap 5 is leading the way in mobile responsive web development! All of the themes on Start Bootstrap are now using Bootstrap 5!</p>
        </div>
      </div>
      <div class="row g-0">
        <div class="col-lg-6 order-lg-2 text-white showcase-img">
          <img class="img-fluid" src="../assets/bg-showcase-3.jpg" alt="..." />
        </div>
        <div class="col-lg-6 order-lg-1 my-auto showcase-text">
          <h2>Easy to Use & Customize</h2>
          <p class="lead mb-0">Landing Page is just HTML and CSS with a splash of SCSS for users who demand some deeper customization options. Out of the box, just add your content and images, and your new landing page will be ready to go!</p>
        </div>
      </div>
    </div>
  </section>
  <!-- Testimonials-->
  <section class="testimonials text-center bg-light">
    <div class="container">
      <h2 class="mb-5">What people are saying...</h2>
      <div class="row">
        <div class="col-lg-4">
          <div class="testimonial-item mx-auto mb-5 mb-lg-0">
            <img class="img-fluid rounded-circle mb-3" src="../assets/testimonials-1.jpg" alt="..." />
            <h5>Margaret E.</h5>
            <p class="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="testimonial-item mx-auto mb-5 mb-lg-0">
            <img class="img-fluid rounded-circle mb-3" src="../assets/testimonials-2.jpg" alt="..." />
            <h5>Fred S.</h5>
            <p class="font-weight-light mb-0">"Bootstrap is amazing. I've been using it to create lots of super nice landing pages."</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="testimonial-item mx-auto mb-5 mb-lg-0">
            <img class="img-fluid rounded-circle mb-3" src="../assets/testimonials-3.jpg" alt="..." />
            <h5>Sarah W.</h5>
            <p class="font-weight-light mb-0">"Thanks so much for making these free resources available to us!"</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Call to Action-->
  <section class="call-to-action text-white text-center" id="signup">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-6">
          <h2 class="mb-4">Ready to get started? Sign up now!</h2>
          <!-- Signup form-->
          <!-- * * * * * * * * * * * * * * *-->
          <!-- * * SB Forms Contact Form * *-->
          <!-- * * * * * * * * * * * * * * *-->
          <!-- This form is pre-integrated with SB Forms.-->
          <!-- To make this form functional, sign up at-->
          <!-- https://startbootstrap.com/solution/contact-forms-->
          <!-- to get an API token!-->
          <form class="form-subscribe" id="contactFormFooter" data-sb-form-api-token="API_TOKEN">
            <!-- Email address input-->
            <div class="row">
              <div class="col">
                <input class="form-control form-control-lg" id="emailAddressBelow" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:required">Email Address is required.</div>
                <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:email">Email Address Email is not valid.</div>
              </div>
              <div class="col-auto"><button class="btn btn-secondary btn-lg" id="submitButton" type="submit">Submit</button></div>
            </div>
            <!-- Submit success message-->
            <!---->
            <!-- This is what your users will see when the form-->
            <!-- has successfully submitted-->
            <div class="d-none" id="submitSuccessMessage">
              <div class="text-center mb-3">
                <div class="fw-bolder">Form submission successful!</div>
                <p>To activate this form, sign up at</p>
                <a class="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
              </div>
            </div>
            <!-- Submit error message-->
            <!---->
            <!-- This is what your users will see when there is-->
            <!-- an error submitting the form-->
            <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div>
          </form>
        </div>
      </div>
    </div>
  </section>
  <!-- Footer-->
  <footer class="footer bg-light">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 h-100 text-center text-lg-start my-auto">
          <ul class="list-inline mb-2">
            <li class="list-inline-item"><a href="#!">About</a></li>
            <li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="#!">Contact</a></li>
            <li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="#!">Terms of Use</a></li>
            <li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="#!">Privacy Policy</a></li>
          </ul>
          <p class="text-muted small mb-4 mb-lg-0">&copy; Your Website 2022. All Rights Reserved.</p>
        </div>
        <div class="col-lg-6 h-100 text-center text-lg-end my-auto">
          <ul class="list-inline mb-0">
            <li class="list-inline-item me-4">
              <a href="#!"><i class="bi-facebook fs-3"></i></a>
            </li>
            <li class="list-inline-item me-4">
              <a href="#!"><i class="bi-twitter fs-3"></i></a>
            </li>
            <li class="list-inline-item">
              <a href="#!"><i class="bi-instagram fs-3"></i></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
  ObjectTemplate,
  ObjectType,
  StatTypeEnum,
  ObjectTypeEnum,
  RegionType,
  RegionEnum
} from '@cybertale/interface'
interface CodeChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}
@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class WelcomeComponent extends Vue {
  statTypeEnum = StatTypeEnum
  objectTypeEnum = ObjectTypeEnum
  objectType = ObjectType
  regionType = RegionType
  regionEnum = RegionEnum
  object!: ObjectTemplate

  async created (): Promise<void> {
    // Generate code verifier and code challenge
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    console.log('nonce:', nonce)

    // Save clientId and codeVerifier to the Vuex store
    this.generateCodeChallengePair().then((codeChallengePair) => {
      this.$store.commit('setCodeVerifier', codeChallengePair.codeVerifier)
      this.$store.commit('setCodeChallenge', codeChallengePair.codeChallenge)
    })
    this.$store.commit('setClientId', '99062c75-d480-4659-82b7-7e0037d7fc52')
    this.$store.commit('setNonce', nonce)
  }

  login (): void {
    const clientId = this.$store.state.clientId
    const redirectUri = process.env.VUE_APP_URL + 'oauth/callback'
    const codeChallenge = this.$store.state.codeChallenge
    const verifier = this.$store.state.codeVerifier
    const nonce = this.$store.state.nonce // Add state parameter
    const query = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&code_challenge=${codeChallenge}&verifier=${verifier}&code_challenge_method=S256&state=${nonce}` // Add state parameter to the query string
    console.log(process.env.VUE_APP_URL + 'oauth/authorize?' + query)
    window.location.href = process.env.VUE_APP_URL + 'oauth/redirect?' + query
  }

  generateCodeChallengePair (): Promise<CodeChallengePair> {
    const codeVerifierBytes = new Uint8Array(64)
    crypto.getRandomValues(codeVerifierBytes)
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(codeVerifierBytes)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const codeChallengeBytes = new TextEncoder().encode(codeVerifier)
    return crypto.subtle.digest('SHA-256', codeChallengeBytes)
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const codeChallenge = btoa(String.fromCharCode.apply(null, hashArray))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '')
        return { codeVerifier, codeChallenge }
      })
  }
}
</script>
<style scoped>
@import '../css/styles.css';

a {
  color: #969b9f;
  text-decoration: none;
}
a:hover {
  color: #606467;
}
</style>
