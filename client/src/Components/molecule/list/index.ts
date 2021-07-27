import Component from '../../../core/Component';
import jsx from '../../../core/jsx';
import CategoryTag from '../../atom/CategoryTag';
import './style';

export interface ListProps {
  tagId: string;
  tagTitle: string;
  type: 'small' | 'large';
  content: string;
  payment: string;
  paymentType: 'income' | 'outcome';
  amount: number;
}

export default class List extends Component<ListProps> {
  $categoryTag: Element;

  constructor(props: ListProps) {
    super(props);

    this.$categoryTag = new CategoryTag({
      id: this.props.tagId,
      title: this.props.tagTitle,
    }).$dom;

    this.setDom();
  }
  render() {
    const { type, content, payment, amount, paymentType } = this.props;

    return jsx`
      <div class='list-component${
        this.props.type === 'large' ? ' list-large' : ''
      }'>
        <div class='title'>
          ${this.$categoryTag}
          ${content}
        </div>
        <div class='payment'>
          ${type === 'large' ? payment : ''}
        </div>
        <div class='amount'>
          ${paymentType === 'outcome' ? '-' : ''}${amount}${
      type === 'large' ? '원' : ''
    }
        </div>
      </div>
    `;
  }
}
