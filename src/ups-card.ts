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

  renderSvg(level:number,color:string){

      return html`

<svg viewBox="0 0 220 320">

<rect

x="30"

y="20"

width="160"

height="260"

rx="18"

fill="#1d1d1d"

stroke="${color}"

stroke-width="4"

/>

<text

x="110"

y="60"

fill="white"

text-anchor="middle"

font-size="18"

font-weight="700"

>

UPS

</text>

<rect

x="55"

y="110"

width="110"

height="34"

rx="6"

fill="none"

stroke="white"

stroke-width="2"

/>

<rect

x="57"

y="112"

width="${level}"

height="30"

rx="4"

fill="${color}"

>

<animate

attributeName="width"

dur="700ms"

to="${level}"

fill="freeze"

/>

</rect>

<text

x="110"

y="190"

fill="white"

font-size="30"

text-anchor="middle"

>

${level}%

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
