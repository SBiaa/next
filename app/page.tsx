import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { RecTimer } from "@/components/RecTimer";
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
    photo: "[FOTO: câmera gravando produto]",
    title: "Vídeo e conteúdo",
    text: "Gravação no seu espaço, edição, Reels, TikTok, YouTube.",
  },
  {
    Icon: MegaphoneIcon,
    photo: "[FOTO: vitrine de promoção / data comemorativa]",
    title: "Campanhas",
    text: "Datas comemorativas, lançamentos, promoções que fazem barulho.",
  },
  {
    Icon: PenIcon,
    photo: "[IMAGEM: mockup de identidade visual]",
    title: "Design e identidade",
    text: "Logo, materiais, panfletos, cartão — tudo com cara de marca grande.",
  },
  {
    Icon: CodeIcon,
    photo: "[IMAGEM: tela de sistema no celular]",
    title: "Tecnologia",
    text: "Ferramentas e soluções que economizam seu tempo e trazem mais cliente.",
  },
];

const SHOTS = [
  "[FOTO: filmmaker com câmera no ombro]",
  "[FOTO: set montado no comércio, luz e tripé]",
  "[FOTO: criador gravando com celular]",
  "[FOTO: edição na ilha / timeline na tela]",
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
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <RecTimer />
              <p className="placeholder-text">
                [FOTO: equipe gravando dentro de uma loja — câmera, luz, cliente no quadro]
              </p>
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
            <StoreIcon size={40} color="#8F8A82" strokeWidth={1.6} />
            <p className="placeholder-text">[FOTO: dono de comércio na correria do balcão]</p>
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
            {SERVICES.map(({ Icon, photo, title, text }) => (
              <div key={title} className="service">
                <div className="service-photo">
                  <p className="placeholder-text">{photo}</p>
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
              {SHOTS.map((label, i) => (
                <div key={label} className={`shot${i % 2 ? " offset" : ""}`}>
                  <p className="placeholder-text">{label}</p>
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
        <span>[WHATSAPP] · [@INSTAGRAM] · [E-MAIL]</span>
      </footer>
    </>
  );
}
