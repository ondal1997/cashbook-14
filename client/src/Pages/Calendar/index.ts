import Component, { PropsType, StateType } from '../../core/Component';
import jsx from '../../core/jsx';
import Header from '../../Components/atom/Header';
import Calendar from '../../Components/atom/Calendar';
import './style';

export default class CalendarPage extends Component<PropsType, StateType> {
  $header: Element;
  $calendar: Element;

  constructor(props: PropsType) {
    super(props);

    this.$header = new Header({
      date: new Date(),
    }).$dom;

    this.$calendar = new Calendar({}).$dom;

    this.setDom();
  }

  render() {
    return jsx`
      <div class='calendar-page'>
        <div class='top'>
          ${this.$header}
        </div>
        <div class='calendar-wrapper'>
          ${this.$calendar}
          <div class='footer'>
            <div>
              총 수입 1,822,480
              총 지출 834,640
            </div>
            <div>
              총계 987,840
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
