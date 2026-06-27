import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface HomeAssistant {
  states: Record<string, any>;
}

@customElement("ups-card")
export class UpsCard extends LitElement {

  @property({ attribute: false })
  public hass!: HomeAssistant;

  @property({ attribute: false })
  public config: any;

  static styles = css`
    :host {
      display:block;
    }

    ha-card{
      padding:24px;
      border-radius:22px;
      overflow:hidden;
    }

    .wrapper{
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:18px;
    }

    .title{
      font-size:28px;
      font-weight:700;
    }

    .status{
      font-size:18px;
      font-weight:600;
    }

    .grid{
      width:100%;
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:12px;
      margin-top:12px;
    }

    .item{
      background:rgba(255,255,255,.05);
      border-radius:14px;
      padding:14px;
      text-align:center;
    }

    svg{
      width:240px;
      height:320px;
    }
  `;

  setConfig(config:any){

      this.config=config;

  }

  render(){

      if(!this.hass) return html``;

      const battery=this.entity(this.config.battery_entity);

      const runtime=this.entity(this.config.runtime_entity);

      const input=this.entity(this.config.input_entity);

      const output=this.entity(this.config.output_entity);

      const load=this.entity(this.config.load_entity);

      const status=this.entity(this.config.status_entity);

      const online=status==="OL";

      const color=online
          ? "#35d07f"
          : "#ff9800";

      return html`

      <ha-card>

      <div class="wrapper">

      <div class="title">

      ⚡ UPS

      </div>

      ${this.renderSvg(battery,color)}

      <div
      class="status"
      style="color:${color}"
      >

      ${online ? "ONLINE" : "BATTERY"}

      </div>

      <div class="grid">

          <div class="item">

          ⚡<br>

          ${input} V

          </div>

          <div class="item">

          ⚡<br>

          ${output} V

          </div>

          <div class="item">

          💻<br>

          ${load} %

          </div>

          <div class="item">

          🔋<br>

          ${runtime} h

          </div>

      </div>

      </div>

      </ha-card>

      `;

  }

  renderSvg(level, color) {

    const percent = Math.max(0, Math.min(100, Number(level)));
    const segments = 10;

    let battery = "";

    for (let i = 0; i < segments; i++) {

        const active = i < Math.round(percent / 10);

        battery += `
        <rect
            x="${58 + i * 15}"
            y="122"
            width="12"
            height="28"
            rx="2"
            fill="${active ? color : "#2b2b2b"}">
        </rect>`;
    }

    return html`

<svg viewBox="0 0 260 340">

<defs>

<linearGradient id="case" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#343434"/>
    <stop offset="100%" stop-color="#151515"/>
</linearGradient>

<filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
    </feMerge>
</filter>

</defs>

<!-- Корпус -->

<rect
x="30"
y="20"
width="200"
height="285"
rx="22"
fill="url(#case)"
stroke="${color}"
stroke-width="3"
filter="url(#glow)"
></rect>

<!-- Верхняя панель -->

<rect
x="40"
y="30"
width="180"
height="48"
rx="10"
fill="#202020"
></rect>

<text
x="130"
y="60"
fill="white"
font-size="18"
font-weight="700"
text-anchor="middle">

INNITTA UPS

</text>

<!-- Светодиод -->

<circle
cx="62"
cy="54"
r="5"
fill="${color}"
filter="url(#glow)">

<animate
attributeName="opacity"
values="1;.4;1"
dur="1.5s"
repeatCount="indefinite"/>

</circle>

<text
x="75"
y="58"
fill="#cfcfcf"
font-size="11">

Power

</text>

<!-- Батарея -->

<rect
x="52"
y="118"
width="156"
height="36"
rx="8"
fill="#111"
stroke="#666">
</rect>

${unsafeHTML(battery)}

<!-- Процент -->

<text
x="130"
y="190"
fill="white"
font-size="34"
font-weight="700"
text-anchor="middle">

${percent}%

</text>

<text
x="130"
y="214"
fill="#BEBEBE"
font-size="14"
text-anchor="middle">

BATTERY LEVEL

</text>

<!-- Нижняя панель -->

<rect
x="48"
y="245"
width="164"
height="42"
rx="8"
fill="#202020">
</rect>

<text
x="130"
y="271"
fill="${color}"
font-size="18"
font-weight="700"
text-anchor="middle">

ONLINE

</text>

</svg>

`;
}
  entity(id:string){

      const state=this.hass.states[id];

      if(!state) return 0;

      return state.state;

  }

  getCardSize(){

      return 5;

  }

}

declare global{
  interface HTMLElementTagNameMap{
    "ups-card":UpsCard;
  }
}
