<template>
  <nav class="navbar navbar-light bg-light static-top">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="../assets/LogoTriM.png" alt="Logo" width="85" class="d-inline-block align-text-top">
      </a>
      <div class="dropdown">
        <button class="btn btn-sm dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ $t.language }}
          <img :src="selectedImage" width="30" class="img-fluid" />
        </button>
        <div class="dropdown-menu bg-light" aria-labelledby="languageDropdown">
          <button class="dropdown-item" @click="changeLanguage('en')">
            <img src="../assets/lang/en.svg" alt="English" width="30" class="img-fluid" />
            {{ $t.english }}
          </button>
          <button class="dropdown-item" @click="changeLanguage('hr')">
            <img src="../assets/lang/hr.svg" alt="Croatian" width="30" class="img-fluid" />
            {{ $t.croatian }}
          </button>
        </div>
      </div>
      <button v-on:click="login()" class="btn btn-outline-secondary">{{ $t.login }}</button>
    </div>
  </nav>

  <!-- Masthead-->
  <header class="masthead">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-6">
          <div class="text-center text-white">
            <h1 class="mb-5">{{ $t.discoverFuture }}</h1>
            <p class="lead mb-5">{{
                $t.harnessPower
              }}</p>
            <!--h2 class="mb-4">Ready to get started? Sign up now!</h2>
            <form class="form-subscribe" id="contactFormFooter" data-sb-form-api-token="API_TOKEN">
              <div class="row">
                <div class="col">
                  <input class="form-control form-control-lg" id="emailAddressBelow" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                  <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:required">Email Address is required.</div>
                  <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:email">Email Address Email is not valid.</div>
                </div>
                <div class="col-auto"><button class="btn btn-secondary btn-lg" id="submitButton" type="submit">Submit</button></div>
              </div>
              <div class="d-none" id="submitSuccessMessage">
                <div class="text-center mb-3">
                  <div class="fw-bolder">Form submission successful!</div>
                  <p>To activate this form, sign up at</p>
                  <a class="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                </div>
              </div>
              <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div>
            </form-->
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- Product Features-->
  <section class="features-icons bg-light text-center">
    <div class="container">
      <!--h2 class="mb-5">Digitize and Manage Your Infrastructure with GeoCMS</h2-->
      <div class="row">
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-lightbulb m-auto text-secondary"></i></div>
            <h3>{{ $t.smartControl }}</h3>
            <p class="lead mb-0">{{ $t.tailoredIoTSolutions }}</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-graph-up m-auto text-secondary"></i></div>
            <h3>{{ $t.dataAnalytics }}</h3>
            <p class="lead mb-0">{{ $t.useAppAnalytics }}</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="features-icons-item mx-auto mb-0 mb-lg-3">
            <div class="features-icons-icon d-flex"><i class="bi-wrench m-auto text-secondary"></i></div>
            <h3>{{ $t.infrastructureManagement }}</h3>
            <p class="lead mb-0">{{
                $t.manageIoTInfrastructure
              }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Use cases -->
  <section class="showcase">
    <div class="container-fluid p-0">
      <div class="row g-0">
        <div class="col-lg-2 order-md-1"></div>
        <div class="col-lg-3 my-auto order-md-2 order-2 showcase-text oval-shape teal-bg">
          <h2 class="title-text mt-1">{{ $t.smartCities }}</h2>
          <p class="lead mb-0 content-text mt-4">{{
              $t.ourSolutionFacilitates
            }}</p>
        </div>
        <div class="col-lg-1 order-md-3"></div>
        <div class="col-lg-6 order-md-4 order-1 text-white showcase-img">
          <img class="img-fluid" src="../assets/smartCity_2.jpg" alt="..." />
        </div>
      </div>
      <div class="row g-0">
        <div class="col-lg-6 order-1 text-white showcase-img">
          <img class="img-fluid" src="../assets/smartCamp_1.jpg" alt="..." />
        </div>
        <div class="col-lg-1 order-md-2"></div>
        <div class="col-lg-3 order-md-3 order-2 my-auto showcase-text oval-shape deep-sea-blue-bg">
          <h2 class="title-text mt-1">{{ $t.smartCamps }}</h2>
          <p class="lead mb-0 mt-4">{{ $t.improveOrganization }}</p>
        </div>
        <div class="col-lg-2 order-md-4"></div>
      </div>
      <div class="row g-0">
        <div class="col-lg-2 order-md-1"></div>
        <div class="col-lg-3 my-auto order-md-2 order-2 showcase-text oval-shape greenish-gray-bg">
          <h2 class="title-text mt-2">{{ $t.smartInfrastructure }}</h2>
          <p class="lead mb-0 mt-4">{{ $t.enhanceInfrastructureProjects }}</p>
        </div>
        <div class="col-lg-1 order-md-3"></div>
        <div class="col-lg-6 order-md-last order-md-4 order-1 text-white showcase-img">
          <img class="img-fluid" src="../assets/smartInfrastructure_3.png" alt="..." />
        </div>
      </div>
    </div>
  </section>
  <!-- Testimonials-->
  <section class="testimonials text-center bg-light">
    <div class="container">
      <h2 class="mb-5">{{ $t.meetOurClients }}</h2>
      <div class="row">
        <div class="col-lg-4">
          <div class="mx-auto mb-5 mb-lg-0">
            <img class="img-fluid mb-3" src="../assets/gradUmag.png" alt="Grad Umag" />
            <h5>Grad Umag</h5>
            <p class="font-weight-light mb-0">"{{
                $t.efficientlyManagingCityLights
              }}"</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="mx-auto mb-5 mb-lg-0">
            <img class="img-fluid mb-3 bg-dark" src="https://majresidence.com/img/logo-maj.svg" alt="Maj Residence" style="width: 28%;" />
            <h5>Maj Residence</h5>
            <p class="font-weight-light mb-0">"{{ $t.enjoyingFlawlessPowerControl }}"</p>
          </div>
        </div>
        <!--div class="col-lg-4">
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
        </div-->
      </div>
    </div>
  </section>
  <!-- Call to Action-->
  <section class="call-to-action text-white text-center" id="signup">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-6">
          <h2 class="mb-4">{{ $t.readyToGetStarted }}</h2>
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
              <!--div class="col">
                <input class="form-control form-control-lg" id="emailAddressBelow" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:required">Email Address is required.</div>
                <div class="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:email">Email Address Email is not valid.</div>
              </div-->
              <div class="col-12">
                <button
                  @click.prevent="redirectToRegistration()"
                  class="btn btn-outline-info btn-lg register-button"
                  id="submitButton"
                  type="submit">
                  {{ $t.register }}
                </button>
              </div>
            </div>
            <!-- Submit success message-->
            <!---->
            <!-- This is what your users will see when the form-->
            <!-- has successfully submitted-->
            <div class="d-none" id="submitSuccessMessage">
              <div class="text-center mb-3">
                <div class="fw-bolder">{{ $t.formSubmissionSuccessful }}</div>
                <p>{{ $t.toActivateThisForm }}</p>
                <a class="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
              </div>
            </div>
            <!-- Submit error message-->
            <!---->
            <!-- This is what your users will see when there is-->
            <!-- an error submitting the form-->
            <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">{{
                $t.errorSendingMessage
              }}</div></div>
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
            <li class="list-inline-item"><a href="https://tri-m.hr/?p=o-nama" target="_blank">{{ $t.about }}</a></li>
            <li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="https://tri-m.hr/?p=kontakt" target="_blank">{{ $t.contact }}</a></li>
            <!--li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="#!">Terms of Use</a></li>
            <li class="list-inline-item">⋅</li>
            <li class="list-inline-item"><a href="#!">Privacy Policy</a></li-->
          </ul>
          <p class="text-muted small mb-4 mb-lg-0">&copy; ECabinet 2023. All Rights Reserved.</p>
        </div>
        <div class="col-lg-6 h-100 text-center text-lg-end my-auto">
          <ul class="list-inline mb-0">
            <!--li class="list-inline-item me-4">
              <a href="#!"><i class="bi-facebook fs-3"></i></a>
            </li>
            <li class="list-inline-item me-4">
              <a href="#!"><i class="bi-twitter fs-3"></i></a>
            </li>
            <li class="list-inline-item">
              <a href="#!"><i class="bi-instagram fs-3"></i></a>
            </li-->
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
import { $t, Translations } from '@/locales'
import router from '@/router'
import { Definitions } from '@/definitions/appDefinitions'
import http, { updateHeaders } from '@/http-common'
interface CodeChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}
@Options({
  computed: {
    $t () {
      return $t
    }
  },
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
  selectedImage = require(`../assets/lang/${localStorage.getItem('lang') || 'en'}.svg`)

  async created (): Promise<void> {
    // Generate code verifier and code challenge
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    console.log('nonce:', nonce)

    // Save clientId and codeVerifier to the Vuex store
    this.generateCodeChallengePair().then((codeChallengePair) => {
      this.$store.commit('setCodeVerifier', codeChallengePair.codeVerifier)
      this.$store.commit('setCodeChallenge', codeChallengePair.codeChallenge)
    })
    this.$store.commit('setClientId', process.env.VUE_APP_CLIENT_ID)
    this.$store.commit('setNonce', nonce)
  }

  async changeLanguage (lang: keyof Translations): Promise<void> {
    localStorage.setItem('lang', lang)
    updateHeaders()
    window.location.href = window.location.origin
    this.selectedImage = require(`../assets/lang/${lang}.svg`)
  }

  login (): void {
    const clientId = this.$store.state.clientId
    const redirectUri = process.env.VUE_APP_URL + 'oauth/callback'
    const codeChallenge = this.$store.state.codeChallenge
    const verifier = this.$store.state.codeVerifier
    const nonce = this.$store.state.nonce // Add state parameter
    const query = `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&code_challenge=${codeChallenge}&verifier=${verifier}&code_challenge_method=S256&state=${nonce}` // Add state parameter to the query string
    // console.log(process.env.VUE_APP_URL + 'oauth/authorize?' + query)
    window.location.href = process.env.VUE_APP_URL + 'oauth/redirect?' + query
  }

  redirectToRegistration () : void {
    const registrationUrl = process.env.VUE_APP_URL + 'register'
    window.open(registrationUrl, '_blank')
  }

  async generateCodeChallengePair (): Promise<CodeChallengePair> {
    const codeVerifierBytes = new Uint8Array(64)
    crypto.getRandomValues(codeVerifierBytes)
    const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(codeVerifierBytes)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const codeChallengeBytes = new TextEncoder().encode(codeVerifier)
    const hashBuffer = await crypto.subtle.digest('SHA-256', codeChallengeBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const codeChallenge = btoa(String.fromCharCode.apply(null, hashArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    return {
      codeVerifier,
      codeChallenge
    }
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
.oval-shape {
  border-radius: 50%; /* Gives the oval shape */
  padding: 20px; /* Adds some space inside the div */
  border: 5px solid white; /* Adds a thick border */
  box-shadow: 5px 5px 0px rgba(0,0,0,0.2); /* Adds a drop shadow */
  color: white; /* Changes the color of the text */
  font-family: 'Roboto', 'Arial', sans-serif; /* Changes the font */
  height: 15rem;
  align-items: center; /* Aligns content vertically */
  justify-content: center;
}

.title-text {
  color: yellow; /* Changes the color of the title text */
  font-family: 'Cambria', sans-serif; /* Changes the font */
}

.teal-bg {
  background: rgba(0, 128, 128, 0.5); /* Semi-transparent teal */
}

.deep-sea-blue-bg {
  background: rgba(0, 0, 139, 0.5); /* Semi-transparent deep sea blue */
}

.greenish-gray-bg {
  background: rgba(50, 125, 105, 0.7); /* Semi-transparent greenish gray */
}

.register-button {
  background-color: #F8F9FA;
}

.register-button:hover {
  background-color: #17a2b8; /* This is the Bootstrap info color, change it as needed */
  color: white;
}

</style>
