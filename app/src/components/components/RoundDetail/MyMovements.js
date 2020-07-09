import React from "react";
import { FlatList } from "react-native";
import MovementItem from "./MovementItem";
import MovementListTitles from "./MovementListTitles";
import CaptionInfo from "../CaptionInfo";
import { amountFormat } from "../../../utils/utils";

const MyMovements = ({
  id,
  shifts,
  frequency,
  roundStartDate,
  paymentAmount,
}) => {
  const payments = [];
  shifts.forEach(shift => payments.push(...shift.pays));
  const myPayments = payments
    .filter(p => p.participant === id)
    .sort((a, b) => a.date < b.date);

  const renderItem = ({ item, index }) => (
    <MovementItem
      date={item.date}
      number={index + 1}
      roundStartDate={roundStartDate}
      frequency={frequency}
      paymentAmount={amountFormat(paymentAmount)}
    />
  );

  if (myPayments.length)
    return (
      <CaptionInfo title="Mis movimientos">
        <MovementListTitles />
        <FlatList
          data={myPayments}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      </CaptionInfo>
    );

  return null;
};

export default MyMovements;
