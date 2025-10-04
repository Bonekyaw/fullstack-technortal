interface FooterProps {
  title: string;
}

interface HeaderProps extends FooterProps {
  noti: number;
}

function Header({ title, noti }: HeaderProps) {
  return (
    <h3>
      {title} noti - {noti}
    </h3>
  );
}

function Footer({ title }: FooterProps) {
  return <h3>{title}</h3>;
}

function About() {
  return (
    <>
      <Header title="About Header" noti={23} />
      <div>
        <h1>About</h1>
      </div>
      <Footer title="About Footer" />
    </>
  );
}

export default About;
