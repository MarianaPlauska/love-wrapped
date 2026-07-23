# Love Wrapped — Roadmap de evolução visual

> Meta: transformar o app numa experiência tão viciante de rolar quanto o Spotify Wrapped, mas com identidade própria de presente de casal.

## Onde estamos

- App mobile-first (430 px) com 22 slides em carrossel auto-avançante.
- Sequência: abertura → data → céu/carta celeste → Top 5 comidas → Top 5 músicas → gênero → métricas → momentos → memórias → versus → capa do ano → resumo.
- Integração NASA (APOD + NASA Image Library) com crédito e fallback.
- Backend Supabase opcional: autora única, link público por token, Spotify OAuth PKCE.
- Build compilando.

## O que estamos implementando agora

### Camada 1 — Textura e luz
- [x] Grain sutil sobreposto em todos os slides (SVG noise fixo).
- [x] Glow suave na foto do casal e nos títulos principais.
- [x] Poeira estelar animada no slide do céu.

### Camada 2 — Tipografia em movimento
- [x] Data "14.04.2024" aparecendo dígito por dígito.
- [x] "Top 1, 2, 3…" entrando grande e encolhendo para revelar o item.
- [x] Contagem de dias como número gigante pulsante.

### Camada 3 — Memórias em Polaroid
- [x] Novo slide `memories` entre os rankings e o resumo.
- [x] Fotos do casal em molduras Polaroid com fita adesiva, cantos dobrados e variação de rotação.
- [x] Legenda manuscrita abaixo de cada foto.
- [x] Placeholders padrão em `public/images/couple/memory-1.svg` a `memory-4.svg`.
- [x] Editor permite substituir cada foto e editar legenda.

### Camada 4 — Comparações divertidas
- [x] Novo slide `versus` com split-screen "Eu vs. Ela".
- [x] Categorias: quem escolhe a música, quem escolhe a comida, quem manda a mensagem, etc.
- [x] Layout 50/50 com cores contrastantes e vencedor destacado.
- [x] Editor permite alterar tópicos, labels e vencedor.

### Camada 5 — Adesivos e rabiscos
- [x] Doodles animados ao redor dos itens dos rankings (garfo, coração, fogo, nota, fone, estrela).
- [x] Foto do casal com contorno branco estilo sticker.
- [x] Emojis/adesivos decorativos nos slides de memórias e versus.

### Camada 6 — Capa do ano
- [x] Novo slide final `year-poster` antes do resumo.
- [x] Cartaz estilizado com destaque "Melhor dia", "Música do ano", "Mood do ano".
- [x] Tipografia grande, formas geométricas coloridas e gradientes vibrantes.
- [x] Editor permite editar headline, melhor dia, música, mood e frase final.

### Interatividade viral
- [x] Swipe horizontal para pular slides (mobile e mouse).
- [x] Botão Pausar/Play no topo.
- [x] Duplo-tap para dar coração flutuante no slide.

## Próximos passos (não iniciados)

1. **Compartilhamento como imagem**
   - [x] Botão de salvar o slide atual como imagem (html-to-image).
   - OG image automática para o link público.
   - QR code para abrir o presente no celular.

2. **Música e som**
   - [x] Permitir escolher entre 3 trilhas padrão no SetupPanel.
   - Tema sonoro original mais marcante.
   - Sincronizar batidas com transições de slides (quando o áudio estiver ligado).

3. **Dados reais e personalização**
   - Importar Top 5 do Spotify com capa do álbum.
   - Buscar fase lunar real por data (JPL Horizons ou API lunar pública).
   - Buscar constelação visível real por local e hora.

4. **Publicação e segurança**
   - Página de preview do link público.
   - Backup dos dados no Supabase Storage (além do JSON do gift).
   - Revisar RLS e permissões do bucket privado.

## Regras de ouro do design

- Manter fundo escuro, contraste alto e paleta neon/gradiente.
- Máximo 1 ação por slide; nada de formulários no carrossel.
- Animações leves e com propósito narrativo, não decoração.
- Todo dado real precisa de fonte (NASA, Spotify, JPL) com crédito visível.
- Priorizar mobile: tudo deve funcionar em 375–430 px antes de qualquer outro tamanho.
