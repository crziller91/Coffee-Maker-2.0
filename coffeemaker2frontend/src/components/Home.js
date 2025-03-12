import { useNavigate } from "react-router-dom";

import { Button } from 'react-bootstrap';

export default function Home() {

  let navigate = useNavigate();

  return (
    <div>
      <header class="bg-dark py-5">
        <div class="container">
          <div class="row align-items-center justify-content-center">
            <div class="col-lg-8 col-xl-7 col-xxl-6">
              <div class="my-5 text-center text-xl-start">
                <h1 class="text-center display-6 fw-bolder text-white mb-2">Welcome to Coffee Maker 2</h1>
                <p class="text-center lead fw-normal text-white-50 mb-4">A remake of the famous coffee maker project from software engineering!</p>
              </div>
            </div>
          </div>
        </div>
      </header>
        <div class="bg-primary bg-gradient p-4 p-sm-5">
          <div class="container px-5 my-5">
            <div class="row gx-5 justify-content-center">
              <div class="col-lg-10 col-xl-7">
                <div class="text-center">
                  <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                    <Button variant="outline-light" size="lg" onClick={() => navigate("/inventory")}>Inventory</Button>
                    <Button variant="outline-light" size="lg" onClick={() => navigate("/recipes")}>Recipes</Button>
                    <Button variant="outline-light" size="lg" onClick={() => navigate("/purchaserecipe")}>Purchase Recipe</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section class="py-5 bg-light">
          <div class="container px-5 my-5">
            <div class="text-center">
              <h2 class="fw-bolder">Meet the creator</h2>
              <br/>
            </div>
            <div class="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-4 justify-content-center">
              <div class="col mb-5 mb-5 mb-xl-0">
                <div class="text-center">
                  <a href="https://www.linkedin.com/in/christianrziller/"><img style={{ width: 200, height: 150 }} class="img-fluid rounded-circle mb-4 px-4" src="profile.JPG" alt="..." /></a>
                    <h5 class="fw-bolder">Christian Ziller</h5>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );

}
