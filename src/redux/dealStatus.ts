import { SET_DEAL_STATUS, SET_SPLIT_DEAL_STATUS } from './constants';

// action creators
interface DealAction {
  type: symbol;
  dealStatus?: boolean;
  splitDealStatus?: boolean;
}

export const setDeal = (dealStatus: boolean): DealAction => {
  return {
    type: SET_DEAL_STATUS,
    dealStatus,
  };
};

export const setSplitDeal = (splitDealStatus: boolean): DealAction => {
  return {
    type: SET_SPLIT_DEAL_STATUS,
    splitDealStatus,
  };
};

const initialState = {
  dealStatus: false,
  splitDealStatus: false,
};

const dealReducer = (state = initialState, action: DealAction) => {
  const dealStatus = action.dealStatus;
  const splitDealStatus = action.splitDealStatus;
  switch (action.type) {
    case SET_DEAL_STATUS:
      return {
        ...state,
        dealStatus,
      };
    case SET_SPLIT_DEAL_STATUS:
      return {
        ...state,
        splitDealStatus,
      };
    default:
      return state;
  }
};

export default dealReducer;
