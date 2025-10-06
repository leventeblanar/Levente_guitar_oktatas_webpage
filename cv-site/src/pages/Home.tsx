import Header from "../components/Header.tsx";
import Hero from "../components/Hero.tsx";
import About from "../components/About.tsx"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <section id="skills">Skills section here</section>
      <section id="projects">Projects section here</section>
      <section id="contact">Contact section here</section>
    </>
  );
}
