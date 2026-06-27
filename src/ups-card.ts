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

    const width = Math.max(0, Math.min(100, Number(level))) * 1.1;

    return html`

<svg viewBox="0 0 260 340">

<defs>

<linearGradient id="body" x1="0" y1="0" x2="0" y2="1">

<stop offset="0%" stop-color="#2b2b2b"/>

<stop offset="100%" stop-color="#171717"/>

</linearGradient>

<filter id="glow">

<feGaussianBlur stdDeviation="6" result="blur"/>

<feMerge>

<feMergeNode in="blur"/>

<feMergeNode in="SourceGraphic"/>

</feMerge>

</filter>

<linearGradient id="batteryFill" x1="0" y1="0" x2="1" y2="0">

<stop offset="0%" stop-color="${color}"/>

<stop offset="100%" stop-color="#ffffff"/>

</linearGradient>

</defs>


<rect
x="30"
y="20"
width="200"
height="290"
rx="24"
fill="url(#body)"
stroke="${color}"
stroke-width="3"
filter="url(#glow)"
/>

<text
x="130"
y="55"
fill="white"
font-size="22"
text-anchor="middle"
font-weight="700"
>

UPS

</text>

<circle
cx="130"
cy="82"
r="6"
fill="${color}"
filter="url(#glow)"
>

<animate
attributeName="opacity"
values="1;0.3;1"
dur="2s"
repeatCount="indefinite"
/>

</circle>


<rect
x="55"
y="120"
width="150"
height="34"
rx="8"
fill="#101010"
stroke="#888"
/>

<rect
x="58"
y="123"
width="${width}"
height="28"
rx="6"
fill="url(#batteryFill)"
>

<animate
attributeName="width"
dur="0.7s"
to="${width}"
fill="freeze"
/>

</rect>


<text
x="130"
y="200"
fill="white"
font-size="34"
font-weight="700"
text-anchor="middle"
>

${level}%

</text>


<text
x="130"
y="235"
fill="#bdbdbd"
font-size="16"
text-anchor="middle"
>

BATTERY

</text>


<g>

<circle cx="130" cy="275" r="3" fill="${color}">
<animate attributeName="cy" values="260;245;230" dur="1.4s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite"/>
</circle>

<circle cx="120" cy="285" r="2" fill="${color}">
<animate attributeName="cy" values="270;255;240" dur="1.8s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
</circle>

<circle cx="140" cy="285" r="2" fill="${color}">
<animate attributeName="cy" values="270;255;240" dur="1.2s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/>
</circle>

</g>

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
