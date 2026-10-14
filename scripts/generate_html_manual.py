# -*- coding: utf-8 -*-
"""
Gerador de HTML a partir do MANUAL_IMPLANTACAO_E_USO_AGROTECH.md
Sem dependências externas.
"""
import re
import html

def md_to_html(md_text):
    lines = md_text.split('\n')
    out = []
    in_code_block = False
    in_table = False
    in_ul = False
    in_ol = False

    for line in lines:
        stripped = line.strip()

        # Blocos de código
        if stripped.startswith('```'):
            if in_code_block:
                out.append('</code></pre>')
                in_code_block = False
            else:
                lang = stripped[3:].strip()
                out.append(f'<pre><code class="language-{lang}">')
                in_code_block = True
            continue

        if in_code_block:
            out.append(html.escape(line))
            continue

        # Tabelas
        if '|' in line and not in_code_block:
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if all(re.match(r'^:?-+:?$', p) for p in parts if p):
                continue  # separador de tabela
            if not in_table:
                in_table = True
                out.append('<table><thead><tr>')
                for p in parts:
                    out.append(f'<th>{p}</th>')
                out.append('</tr></thead><tbody>')
            else:
                out.append('<tr>')
                for p in parts:
                    out.append(f'<td>{p}</td>')
                out.append('</tr>')
            continue
        elif in_table:
            out.append('</tbody></table>')
            in_table = False

        # Linhas em branco
        if not stripped:
            if in_ul:
                out.append('</ul>')
                in_ul = False
            if in_ol:
                out.append('</ol>')
                in_ol = False
            continue

        # Títulos
        if stripped.startswith('# '):
            out.append(f'<h1>{html.escape(stripped[2:])}</h1>')
            continue
        elif stripped.startswith('## '):
            title = stripped[3:]
            slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower().replace(' ', '-')
            out.append(f'<h2 id="{slug}">{html.escape(title)}</h2>')
            continue
        elif stripped.startswith('### '):
            out.append(f'<h3>{html.escape(stripped[4:])}</h3>')
            continue
        elif stripped.startswith('#### '):
            out.append(f'<h4>{html.escape(stripped[5:])}</h4>')
            continue

        # Linha horizontal
        if stripped in ('---', '***', '___'):
            out.append('<hr>')
            continue

        # Imagens
        img_match = re.match(r'^!\[(.*?)\]\((.*?)\)$', stripped)
        if img_match:
            alt, src = img_match.groups()
            out.append(f'<figure><img src="{src}" alt="{alt}"></figure>')
            continue

        # Itens de lista
        if stripped.startswith('- ') or stripped.startswith('* '):
            if not in_ul:
                out.append('<ul>')
                in_ul = True
            item_text = stripped[2:]
            # formata negrito e código
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
            item_text = re.sub(r'`(.*?)`', r'<code>\1</code>', item_text)
            out.append(f'<li>{item_text}</li>')
            continue
        elif re.match(r'^\d+\.\s', stripped):
            if not in_ol:
                out.append('<ol>')
                in_ol = True
            item_text = re.sub(r'^\d+\.\s', '', stripped)
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
            item_text = re.sub(r'`(.*?)`', r'<code>\1</code>', item_text)
            out.append(f'<li>{item_text}</li>')
            continue

        if in_ul:
            out.append('</ul>')
            in_ul = False
        if in_ol:
            out.append('</ol>')
            in_ol = False

        # Parágrafos normais com negrito e código inline
        para = stripped
        para = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', para)
        para = re.sub(r'`(.*?)`', r'<code>\1</code>', para)
        para = re.sub(r'\*(.*?)\*', r'<em>\1</em>', para)
        out.append(f'<p>{para}</p>')

    if in_code_block:
        out.append('</code></pre>')
    if in_table:
        out.append('</tbody></table>')
    if in_ul:
        out.append('</ul>')
    if in_ol:
        out.append('</ol>')

    return '\n'.join(out)

with open('/home/user/agtech-platform/MANUAL_IMPLANTACAO_E_USO_AGROTECH.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

html_body = md_to_html(md_content)

html_template = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AGROTECH Enterprise • Manual Oficial de Operação e Implantação</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-canvas: #F8FAF6;
      --card-bg: #FFFFFF;
      --border-color: #E2E8DF;
      --text-main: #122117;
      --text-muted: #526356;
      --primary: #1B4D3E;
      --primary-hover: #143B2F;
      --primary-light: #E8F3EE;
      --sidebar-bg: #0F172A;
      --sidebar-text: #94A3B8;
      --sidebar-active: #38BDF8;
      --accent-green: #10B981;
      --accent-amber: #D97706;
      --accent-red: #EF4444;
      --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-heading: 'Outfit', sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      background-color: var(--bg-canvas);
      color: var(--text-main);
      font-family: var(--font-body);
      line-height: 1.65;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
    }}

    .layout-wrapper {{
      display: flex;
      max-width: 1600px;
      margin: 0 auto;
      min-height: 100vh;
    }}

    /* Sidebar Fixa */
    .sidebar {{
      width: 320px;
      background-color: var(--sidebar-bg);
      color: var(--sidebar-text);
      padding: 24px 18px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      flex-shrink: 0;
      border-right: 1px solid #1E293B;
      scrollbar-width: thin;
      scrollbar-color: #334155 transparent;
    }}

    .sidebar-header {{
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 20px;
      border-bottom: 1px solid #1E293B;
      margin-bottom: 20px;
    }}

    .logo-badge {{
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #1B4D3E 0%, #2D7A5E 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-family: var(--font-heading);
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(27, 77, 62, 0.35);
    }}

    .sidebar-title {{
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 700;
      color: #F8FAFC;
      letter-spacing: -0.02em;
    }}

    .sidebar-subtitle {{
      font-size: 11px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}

    .nav-label {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748B;
      margin: 16px 0 8px 6px;
    }}

    .nav-links {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }}

    .nav-links a {{
      color: var(--sidebar-text);
      text-decoration: none;
      font-size: 12.5px;
      padding: 7px 10px;
      border-radius: 6px;
      display: block;
      transition: all 0.15s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}

    .nav-links a:hover {{
      background-color: #1E293B;
      color: #F8FAFC;
      transform: translateX(2px);
    }}

    /* Conteúdo Principal */
    .content {{
      flex: 1;
      padding: 40px 50px;
      max-width: 1100px;
      overflow-x: hidden;
    }}

    .top-actions {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      padding: 14px 20px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }}

    .status-pill {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #166534;
      background: #DCFCE7;
      padding: 4px 12px;
      border-radius: 999px;
    }}

    .btn-print {{
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }}

    .btn-print:hover {{
      background: var(--primary-hover);
    }}

    /* Estilos do Markdown Convertido */
    h1 {{
      font-family: var(--font-heading);
      font-size: 28px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 8px;
      letter-spacing: -0.03em;
    }}

    h2 {{
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 36px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E2E8DF;
      letter-spacing: -0.02em;
    }}

    h3 {{
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 600;
      color: #1E293B;
      margin-top: 22px;
      margin-bottom: 10px;
    }}

    p {{
      margin-bottom: 14px;
      color: #334155;
    }}

    strong {{
      color: #0F172A;
      font-weight: 600;
    }}

    ul, ol {{
      margin-left: 22px;
      margin-bottom: 16px;
      color: #334155;
    }}

    li {{
      margin-bottom: 6px;
    }}

    hr {{
      border: 0;
      height: 1px;
      background: var(--border-color);
      margin: 32px 0;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0 24px 0;
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
      font-size: 13.5px;
    }}

    th {{
      background-color: #F1F5F0;
      color: #0F172A;
      font-weight: 700;
      text-align: left;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-color);
      font-family: var(--font-heading);
    }}

    td {{
      padding: 10px 14px;
      border-bottom: 1px solid #EDF2EB;
      color: #334155;
    }}

    tr:last-child td {{
      border-bottom: none;
    }}

    tr:hover td {{
      background-color: #FBFDFB;
    }}

    code {{
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 12.5px;
      background: #EAEFE7;
      color: #1B4D3E;
      padding: 2px 6px;
      border-radius: 4px;
    }}

    pre {{
      background: #0F172A;
      color: #E2E8F0;
      padding: 16px 20px;
      border-radius: 10px;
      overflow-x: auto;
      margin: 16px 0 22px 0;
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 12.5px;
      line-height: 1.5;
      border: 1px solid #1E293B;
    }}

    pre code {{
      background: transparent;
      color: inherit;
      padding: 0;
    }}

    img {{
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      margin: 14px 0 6px 0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }}

    em {{
      font-size: 13px;
      color: #64748B;
      display: block;
      margin-bottom: 14px;
    }}

    @media print {{
      .sidebar, .top-actions {{ display: none !important; }}
      .content {{ padding: 0 !important; max-width: 100% !important; }}
      body {{ background: #FFF !important; color: #000 !important; font-size: 11pt !important; }}
      pre {{ background: #F1F5F9 !important; color: #0F172A !important; border: 1px solid #CBD5E1 !important; }}
      h2 {{ page-break-before: always; }}
    }}
  </style>
</head>
<body>
  <div class="layout-wrapper">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-badge">AT</div>
        <div>
          <div class="sidebar-title">AGROTECH</div>
          <div class="sidebar-subtitle">Manual Enterprise v3.0</div>
        </div>
      </div>

      <div class="nav-label">29 Processos Operacionais</div>
      <ul class="nav-links">
        <li><a href="#1-visão-geral-arquitetura-e-ergonomia-visual-60-30-10">1. Ergonomia e Paleta 60-30-10</a></li>
        <li><a href="#2-acesso-autenticação-e-perfis-operacionais-rbac">2. Acesso e Perfis RBAC</a></li>
        <li><a href="#3-navegação-e-cockpit-central-de-comando">3. Navegação & Topbar</a></li>
        <li><a href="#4-configuração-de-módulos-produtivos-e-culturas-da-safra">4. Configuração de Módulos</a></li>
        <li><a href="#5-mapeamento-geoespacial-talhões-e-cadastro-ambiental-rural-car">5. Mapeamento SIG e CAR</a></li>
        <li><a href="#6-manual-de-instalação-física-do-chicote-telemático-can-bus-sae-j1939--iso-11783">6. Chicote CAN J1939</a></li>
        <li><a href="#7-protocolo-de-validação-e-comissionamento-in-loco-com-operadores">7. Comissionamento de Cabine</a></li>
        <li><a href="#8-monitoramento-psicrométrico-de-delta-t-asabe-s572-e-aplicações">8. Monitoramento Delta T</a></li>
        <li><a href="#9-resiliência-offline-first-e-sincronização-de-campo-princípio-12---outbox-pattern">9. Resiliência Offline Outbox</a></li>
        <li><a href="#10-módulo-fiscal-nf-e-do-produtor-mod-55-e-lcdpr-sped-0013">10. NF-e e LCDPR SPED</a></li>
        <li><a href="#11-esg--due-diligence-antidesmatamento-europeu-eudr-20231115">11. ESG & EUDR Antidesmatamento</a></li>
        <li><a href="#12-gestão-financeira-cpr-eletrônica-b3-e-hedge-cambial-ndf">12. Finanças, CPR B3 e NDF</a></li>
        <li><a href="#13-zoneamento-de-risco-climático-zarc-e-renovabio-cbios">13. ZARC & RenovaBio CBIOs</a></li>
        <li><a href="#14-governança-e-matriz-de-permissões-rbac-superadmin">14. Governança RBAC Superadmin</a></li>
        <li><a href="#15-resolução-de-problemas-suporte-e-dúvidas-frequentes-faq">15. FAQ & Diagnóstico</a></li>
        <li><a href="#16-guia-de-instalação-local-e-servidor-on-premises-na-fazenda">16. Instalação Local (Fazenda)</a></li>
        <li><a href="#17-guia-de-hospedagem-e-deploy-nas-principais-nuvens-do-brasil">17. Hospedagem Nuvem Brasil</a></li>
        <li><a href="#18-módulo-fiscal-avançado-sefaz-assinatura-xmldsig-icp-brasil-e-contingência-epec">18. SEFAZ XMLDSig e EPEC</a></li>
        <li><a href="#19-reforma-tributária-da-ec-1322023-split-payment-ibs-cbs-e-auditoria-dos-regimes-fiscais-agro">19. Reforma Tributária EC 132</a></li>
        <li><a href="#20-conciliação-bancária-ofx-automática-e-injeção-no-sped-lcdpr-registro-q100">20. Conciliação Bancária OFX</a></li>
        <li><a href="#21-prescrição-em-taxa-variável-vra-iso-xml-iso-11783-10-e-pen-drive-isobus">21. Prescrição VRA ISO-XML</a></li>
        <li><a href="#22-copilot-agronômico-ordem-de-tanque-dale-e-carência-fitossanitária-lmr">22. Ordem de Calda D.A.L.E.</a></li>
        <li><a href="#23-oee-agrícola-de-frotas-e-manutenção-preditiva-can-bus">23. OEE e Manutenção Preditiva</a></li>
        <li><a href="#24-defesa-sanitária-agropecuária-emissão-de-cfo-vegetal-e-e-gta-animal-mapaindea">24. Defesa Sanitária CFO / GTA</a></li>
        <li><a href="#25-financiamento-rural-oficial-plano-safra-bacen-mcr-e-dossiê-bancário-scr">25. Plano Safra & Dossiê MCR</a></li>
        <li><a href="#26-segurança-e-saúde-no-trabalho-rural-nr-31-e-esocial-rural-evento-s-2240">26. NR-31 & eSocial S-2240</a></li>
        <li><a href="#27-rastreabilidade-digital-de-grãos-por-lote-e-passaporte-eudr-com-qr-code">27. Rastreabilidade & QR Code</a></li>
        <li><a href="#28-faturamento-saas-billing-e-assinaturas-via-pix-bacen-em-tempo-real">28. SaaS Billing & Pix BACEN</a></li>
        <li><a href="#29-painel-de-credenciais-corporativas-e-mascaramento-de-segredos-de-campo">29. Credenciais & Segurança A1</a></li>
      </ul>
    </aside>

    <main class="content">
      <div class="top-actions">
        <div class="status-pill">
          <span>●</span> Documento Homologado • 29 Processos Ativos
        </div>
        <button class="btn-print" onclick="window.print()">
          🖨️ Imprimir / Salvar PDF
        </button>
      </div>

      <div class="markdown-body">
        {html_body}
      </div>
    </main>
  </div>
</body>
</html>
"""

with open('/home/user/agtech-platform/MANUAL_ILUSTRADO_AGROTECH.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

with open('/home/user/MANUAL_ILUSTRADO_AGROTECH.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print("Manual HTML gerado com sucesso!")
print("Tamanho total:", len(html_template), "bytes")
