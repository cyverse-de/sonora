/**
 * Shared chartjs-plugin-datalabels options for the consumption bar charts
 * (CPU, Data and GPU).
 *
 * The label is only shown when it fits inside the bar, rather than past a
 * fixed usage percentage. Otherwise it's hidden; the chart title and tooltip
 * still show the usage.
 */
import { Chart as ChartJS } from "chart.js";

const LABEL_PADDING = 1;

const measureText = (ctx, text) => {
    ctx.save();
    ctx.font = `bold ${ChartJS.defaults.font.size}px ${ChartJS.defaults.font.family}`;
    const { width } = ctx.measureText(text);
    ctx.restore();
    return width + 2 * LABEL_PADDING;
};

const labelFits = (context, formatter) => {
    const { chart, datasetIndex, dataIndex, dataset } = context;
    const bar = chart.getDatasetMeta(datasetIndex).data[dataIndex];
    if (!bar) {
        return false;
    }

    // use the bar's final geometry so the label doesn't flip during animation
    const { x: barEnd, base: barStart } = bar.getProps(["x", "base"], true);
    const labelWidth = measureText(
        chart.ctx,
        formatter(dataset.data[dataIndex])
    );

    return labelWidth <= Math.abs(barEnd - barStart);
};

/**
 * @param {function} formatter - formats a bar's value into its label text
 * @param {object} theme - the MUI theme
 * @returns datalabels plugin options
 */
export const getConsumptionDataLabels = (formatter, theme) => ({
    display: (context) => labelFits(context, formatter),
    backgroundColor: (context) => context.dataset.backgroundColor,
    borderRadius: 4,
    color: theme.palette.primary.contrastText,
    font: {
        weight: "bold",
    },
    formatter,
    padding: LABEL_PADDING,
});
