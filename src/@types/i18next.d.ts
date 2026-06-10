import "i18next";
import common from "../i18n/namespaces/en/common.json";
import settings from "../i18n/namespaces/en/settings.json";
import categories from "../i18n/namespaces/en/categories.json";
import categoryForm from "../i18n/namespaces/en/categoryForm.json";
import chat from "../i18n/namespaces/en/chat.json";
import dashboard from "../i18n/namespaces/en/dashboard.json";
import categoryChart from "../i18n/namespaces/en/categoryChart.json";
import monthChart from "../i18n/namespaces/en/monthChart.json";
import objectiveDisplay from "../i18n/namespaces/en/objectiveDisplay.json";
import expenses from "../i18n/namespaces/en/expenses.json";
import viewCategory from "../i18n/namespaces/en/viewCategory.json";
import viewExpense from "../i18n/namespaces/en/viewExpense.json";
import chatBubble from "../i18n/namespaces/en/chatBubble.json";
import chooseCategoryModal from "../i18n/namespaces/en/chooseCategoryModal.json";
import chooseIconModal from "../i18n/namespaces/en/chooseIconModal.json";
import dateModal from "../i18n/namespaces/en/dateModal.json";
import formModal from "../i18n/namespaces/en/formModal.json";
import modal from "../i18n/namespaces/en/modal.json";
import messageErrors from "../i18n/namespaces/en/messageErrors.json";
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    fallbackNS: "common";
    resources: {
      common: typeof common;
      settings: typeof settings;
      categories: typeof categories;
      categoryForm: typeof categoryForm;
      chat: typeof chat;
      dashboard: typeof dashboard;
      categoryChart: typeof categoryChart;
      monthChart: typeof monthChart;
      objectiveDisplay: typeof objectiveDisplay;
      expenses: typeof expenses;
      viewCategory: typeof viewCategory;
      viewExpense: typeof viewExpense;
      chatBubble: typeof chatBubble;
      chooseCategoryModal: typeof chooseCategoryModal;
      chooseIconModal: typeof chooseIconModal;
      dateModal: typeof dateModal;
      formModal: typeof formModal;
      modal: typeof modal;
      messageErrors: typeof messageErrors;
    };
  }
}
