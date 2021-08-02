import Component from '@/core/Component';
import jsx from '@/core/jsx';
import { delete as delbtn } from '@/../assets';
import './style';
import { CategoryType, PaymentType } from '@/shared/type';
import Alert from '@/Components/molecule/Alert';

interface DropDownProps {
  selectType: 'payment' | 'category';
  items: CategoryType[] | PaymentType[];
  setContent: Function;
  paymentType?: 'income' | 'outcome';
}

interface DropDownState {
  isAlertOpened: boolean;
}

export default class DropDown extends Component<DropDownProps, DropDownState> {
  $alert: Element = jsx``;
  openDelAlert = (e: Event, item: CategoryType | PaymentType) => {
    e.stopPropagation();

    this.$alert = new Alert({
      closeAlert: () => this.setState({ isAlertOpened: false }),
      select: this.props.selectType,
      type: 'delete',
      delItem: item,
      content: `해당 ${
        this.props.selectType === 'category' ? '카테고리를' : '결제수단을'
      } 삭제하시겠습니까?`,
    }).$dom;

    this.setState({ isAlertOpened: true });
  };
  openAddAlert = () => {
    this.$alert = new Alert({
      closeAlert: () => this.setState({ isAlertOpened: false }),
      select: this.props.selectType,
      type: 'add',
      paymentType: this.props.paymentType as 'income' | 'outcome',
      content:
        this.props.selectType === 'category'
          ? '카테고리 추가'
          : '결제수단 추가',
    }).$dom;

    this.setState({ isAlertOpened: true });
  };

  constructor(props: DropDownProps) {
    super(props);

    this.state = {
      isAlertOpened: false,
    };

    this.setDom();
  }

  render() {
    const { items, setContent } = this.props;

    return jsx`
      <div onClick=${(e: Event) => e.stopPropagation()}
        class='dropdown-wrapper'>

        <div class='dropdown'>
          ${items.map(
            (item) =>
              jsx`
              <div onClick=${() => setContent(item)} class='dropdown__item'>${
                item.name
              }<img onClick=${(e: Event) =>
                this.openDelAlert(e, item)} src=${delbtn} />
              </div>`
          )}
        </div>
        
        <div onClick=${this.openAddAlert} class='add-btn'>+</div>

          ${
            this.state.isAlertOpened
              ? jsx`
                <div>
                  <div class='modal-container'>
                    ${this.$alert}
                  </div>
                  <div class='background' />
                </div>
              `
              : ''
          }
      </div>
    `;
  }
}