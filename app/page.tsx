import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { Photo } from "@/components/Photo";
import { RecTimer } from "@/components/RecTimer";
import { ScrollEffects } from "@/components/ScrollEffects";
import { Team } from "@/components/Team";
import {
  BulbIcon,
  ChatCheckIcon,
  ChatIcon,
  CodeIcon,
  FilmIcon,
  MegaphoneIcon,
  PenIcon,
  RocketIcon,
  StoreIcon,
  TagIcon,
  VideoIcon,
} from "@/components/Icons";

// Contatos do rodapé — preencha aqui.
const WHATSAPP = "[WHATSAPP]";
const INSTAGRAM = "[@INSTAGRAM]";
const EMAIL = "[E-MAIL]";

const MARQUEE = "Vídeo ▸ Campanha ▸ Design ▸ Tecnologia ▸ Conteúdo ▸ ";

const STEPS = [
  {
    n: "01",
    color: "#FFB37A",
    iconBg: "#2A2018",
    Icon: ChatIcon,
    title: "Você conta o objetivo",
    text: "Vender mais, lançar produto, encher a loja na data, aparecer na cidade.",
  },
  {
    n: "02",
    color: "#FF8A3D",
    iconBg: "#2A1C12",
    Icon: BulbIcon,
    title: "A gente cria a ideia",
    text: "Campanha, roteiro, conteúdo, ferramenta. Pensado pro seu negócio, não copiado de modelo.",
  },
  {
    n: "03",
    color: "#FF5A1F",
    iconBg: "#2A160E",
    Icon: RocketIcon,
    title: "A gente executa e entrega",
    text: "Gravamos no local, editamos, criamos, publicamos. Você só aprova e vê acontecer.",
  },
];

const SERVICES = [
  {
    Icon: VideoIcon,
    photo: "servico-video.jpg",
    alt: "Câmera gravando um produto em cima do balcão de uma loja",
    title: "Vídeo e conteúdo",
    text: "Gravação no seu espaço, edição, Reels, TikTok, YouTube.",
  },
  {
    Icon: MegaphoneIcon,
    photo: "servico-campanhas.jpg",
    alt: "Vitrine de loja decorada para uma promoção de data comemorativa",
    title: "Campanhas",
    text: "Datas comemorativas, lançamentos, promoções que fazem barulho.",
  },
  {
    Icon: PenIcon,
    photo: "servico-design.jpg",
    alt: "Materiais de identidade visual de uma marca: logo, cartão e panfleto",
    title: "Design e identidade",
    text: "Logo, materiais, panfletos, cartão — tudo com cara de marca grande.",
  },
  {
    Icon: CodeIcon,
    photo: "servico-tecnologia.jpg",
    alt: "Mão segurando um celular com a tela de um sistema de atendimento",
    title: "Tecnologia",
    text: "Ferramentas e soluções que economizam seu tempo e trazem mais cliente.",
  },
];

const SHOTS = [
  { file: "bastidores-1.jpg", alt: "Filmmaker gravando com a câmera no ombro" },
  { file: "bastidores-2.jpg", alt: "Set de gravação montado dentro de um comércio, com luz e tripé" },
  { file: "bastidores-3.jpg", alt: "Criador de conteúdo gravando um vídeo com o celular" },
  { file: "bastidores-4.jpg", alt: "Vídeo sendo editado, com a linha do tempo aberta na tela" },
];

const IDEAS = [
  { Icon: StoreIcon, text: "Uma série de vídeos dos bastidores da sua loja que vira conversa na cidade." },
  { Icon: TagIcon, text: "Uma campanha de Black Friday pensada, gravada e no ar em uma semana." },
  { Icon: FilmIcon, text: "O lançamento do seu produto novo com vídeo de cinema." },
  { Icon: ChatCheckIcon, text: "Um sistema que tira do seu WhatsApp o atendimento repetitivo." },
];

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <header className="header">
        <a href="#topo" className="brand">
          <Logo label="Logo Next" />
          <span>next</span>
        </a>
        <nav aria-label="Principal" className="nav">
          <a href="#como">Como funciona</a>
          <a href="#servicos">Serviços</a>
          <a href="#time">Time</a>
        </nav>
        <a href="#contato" className="btn btn-primary">
          Bora conversar
        </a>
      </header>

      <main>
        {/* Hero */}
        <section id="topo" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Marketing · Vídeo · Design · Tecnologia</p>
            <h1>
              Você traz o objetivo.
              <br />
              <span className="accent">A gente faz acontecer.</span>
            </h1>
            <p className="hero-lead">
              Marketing, vídeo, design e tecnologia pra colocar o seu comércio no próximo nível. Ideia,
              gravação, execução e entrega — tudo com a Next.
            </p>
            <div className="hero-ctas">
              <a href="#contato" className="btn btn-primary">
                Bora conversar
              </a>
              <a href="#como" className="btn btn-ghost">
                Como funciona
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="viewfinder">
              <Photo
                file="hero-gravacao-loja.jpg"
                alt="Equipe da Next gravando dentro de uma loja, com câmera, luz e o cliente no quadro"
                sizes="(max-width: 960px) 100vw, 480px"
                mark="center"
                priority
              />
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <RecTimer />
            </div>
            <div className="badge">
              <Logo width={30} height={35} variant="dark" />
              <div>
                <p className="badge-kicker">Gravação no local</p>
                <p className="badge-title">A gente vai até você</p>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa */}
        <div className="marquee" aria-label="Vídeo, Campanha, Design, Tecnologia, Conteúdo">
          <div className="marquee-track" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <p key={i}>{MARQUEE.repeat(2)}</p>
            ))}
          </div>
        </div>

        {/* Problema */}
        <section className="problem">
          <div className="problem-copy">
            <h2 className="h2">
              Ideia boa parada <span className="accent">não vende nada.</span>
            </h2>
            <p className="p1">
              Você sabe que precisa de vídeo, de campanha, de presença. Mas entre atender cliente, cuidar do
              estoque e fechar o caixa, o marketing fica pra &ldquo;semana que vem&rdquo;. Toda semana.
            </p>
            <p className="p2">
              A Next existe pra tirar isso do papel. <strong>Sem você precisar tocar o projeto.</strong>
            </p>
          </div>
          <div className="photo-square">
            <Photo
              file="problema-balcao.jpg"
              alt="Dono de comércio atendendo no balcão em um momento de movimento"
              sizes="(max-width: 960px) 100vw, 480px"
              mark="bl"
            />
          </div>
        </section>

        {/* Como funciona */}
        <section id="como" className="how">
          <div className="wrap">
            <p className="eyebrow">Como funciona</p>
            <h2 className="h2">Três passos. Zero enrolação.</h2>
            <div className="steps">
              {STEPS.map(({ n, color, iconBg, Icon, title, text }) => (
                <div key={n} className="step" style={{ "--c": color } as CSSProperties}>
                  <div className="step-head">
                    <p className="step-num">{n}</p>
                    <div className="step-icon" style={{ background: iconBg }}>
                      <Icon size={30} color={color} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section id="servicos" className="wrap services">
          <p className="eyebrow">O que a gente faz</p>
          <h2 className="h2">Tudo que o seu comércio precisa pra ser visto.</h2>
          <div className="service-grid">
            {SERVICES.map(({ Icon, photo, alt, title, text }) => (
              <div key={title} className="service">
                <div className="service-photo">
                  <Photo
                    file={photo}
                    alt={alt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1240px) 50vw, 300px"
                    mark="br"
                  />
                </div>
                <div className="service-body">
                  <div className="service-icon">
                    <Icon size={26} color="#0E0E10" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bastidores */}
        <section className="backstage">
          <div className="wrap">
            <div className="backstage-head">
              <h2 className="h2">
                Bastidores: <span className="accent">a gente vai até você.</span>
              </h2>
              <div className="rec">
                <span className="rec-dot" />
                GRAVANDO AGORA
              </div>
            </div>
            <div className="shots">
              {SHOTS.map(({ file, alt }, i) => (
                <div key={file} className={`shot${i % 2 ? " offset" : ""}`}>
                  <Photo
                    file={file}
                    alt={alt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1240px) 50vw, 300px"
                    mark={i % 2 ? "tr" : "bl"}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Imagina */}
        <section className="imagine">
          <div className="wrap">
            <h2 className="h2">Imagina isso no seu negócio:</h2>
            <div className="ideas">
              {IDEAS.map(({ Icon, text }) => (
                <div key={text} className="idea">
                  <Icon size={36} color="#0E0E10" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p className="imagine-cta">
              Seu objetivo é outro? Melhor ainda. <a href="#contato">Conta pra gente →</a>
            </p>
          </div>
        </section>

        {/* Time */}
        <section id="time" className="wrap team">
          <div className="team-head">
            <div>
              <p className="eyebrow">Quem faz</p>
              <h2 className="h2">
                Não é freelancer. <span className="accent">É time.</span>
              </h2>
            </div>
            <p>
              Estratégia, criação, filmmaking, edição e gente que vive de internet todo dia — seis cabeças
              trabalhando no mesmo projeto, o seu.
            </p>
          </div>
          <Team />
        </section>

        {/* Contato */}
        <section id="contato" className="contact">
          <Logo width={520} height={612} variant="solid" className="contact-mark" />
          <div className="wrap">
            <h2>Qual é o próximo nível do seu negócio?</h2>
            <p className="contact-lead">Conta o objetivo. A ideia e a execução são com a gente.</p>
            <a href="/cadastro" className="btn">
              Quero fazer acontecer
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>next — Marketing, conteúdo e tecnologia para o seu próximo nível.</span>
        <span>
          {WHATSAPP} · {INSTAGRAM} · {EMAIL}
        </span>
      </footer>
    </>
  );
}
