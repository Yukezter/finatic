// import React from 'react'
// import { styled } from '@mui/material/styles';
// import { AxiosResponse } from 'axios'
// import { useQuery } from 'react-query'
// import Chart from 'chart.js/auto'
// import makeStyles from '@mui/styles/makeStyles';
// import createStyles from '@mui/styles/createStyles';
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import Skeleton from '@mui/material/Skeleton'

// const PREFIX = 'SectorsChart';

// const classes = {
//   flexContainer: `${PREFIX}-flexContainer`
// };

// const StyledDoughnutChart = styled(DoughnutChart)(({
//   theme: { breakpoints, spacing }
// }) =>
//   ({
//     [`& .${classes.flexContainer}`]: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       paddingTop: spacing(2),
//       paddingBottom: spacing(2),
//       marginBottom: spacing(4),
//       '& > div': {
//         width: '100%',
//       },
//       '& > div:first-child': {
//         maxWidth: 480,
//         position: 'relative',
//         marginLeft: 'auto',
//         marginRight: 'auto',
//       },
//       '& > div:nth-child(2)': {
//         flex: '0 0 100%',
//       },
//       [breakpoints.up('sm')]: {
//         '& > div:first-child': {
//           marginBottom: 32,
//         },
//         '& > div:nth-child(2)': {
//           flex: '0 0 220px',
//         },
//       },
//       [breakpoints.up(breakpoints.values.sm + spacing(12))]: {
//         flexDirection: 'row',
//         '& > div:first-child': {
//           maxWidth: 300,
//           marginLeft: 16,
//           marginBottom: 0,
//         },
//         '& > div:nth-child(2)': {
//           flexBasis: 280,
//         },
//       },
//       [breakpoints.up('lg')]: {
//         '& > div:nth-child(2)': {
//           flexBasis: 260,
//         },
//       },
//     }
//   }));

// const sectorMarketCaps = [
//   {
//     name: 'Utilities',
//     marketCap: 1.58,
//   },
//   {
//     name: 'Real Estate',
//     marketCap: 1.67,
//   },
//   {
//     name: 'Materials',
//     marketCap: 2.54,
//   },
//   {
//     name: 'Energy',
//     marketCap: 2.95,
//   },
//   {
//     name: 'Consumer Staples',
//     marketCap: 4.45,
//   },
//   {
//     name: 'Industrials',
//     marketCap: 5.81,
//   },
//   {
//     name: 'Communication Services',
//     marketCap: 6.71,
//   },
//   {
//     name: 'Financials',
//     marketCap: 8.97,
//   },
//   {
//     name: 'Consumer Discretionary',
//     marketCap: 8.92,
//   },
//   {
//     name: 'Health Care',
//     marketCap: 8.07,
//   },
//   {
//     name: 'Technology',
//     marketCap: 15.54,
//   },
// ]
//   .reverse()
//   .reduce((acc: any, curr: any, index) => {
//     acc[curr.name] = {
//       index,
//       marketCap: curr.marketCap,
//     }
//     return acc
//   }, {})

// const DoughnutChart = ({ theme,  data }: any) => {
//   const canvasRef = React.useRef<any>()
//   const chartRef = React.useRef<Chart>()
//   const [labels, setLabels] = React.useState<any[]>()

//   const getDataColor = React.useCallback((value: number) => {
//     const color = value < 0 ? theme.palette.error : theme.palette.success
//     let shade = color.main
//     if (Math.abs(value) > 1) shade = color.dark
//     return shade
//   }, [])

//   const sortedData = React.useMemo(
//     () =>
//       data
//         .sort((a: any, b: any) => {
//           return sectorMarketCaps[a.name].index - sectorMarketCaps[b.name].index
//         })
//         .map((sector: any) => {
//           sector.performance = Number((sector.performance * 100).toFixed(2))
//           sector.marketCap = Math.round(sectorMarketCaps[sector.name].marketCap)
//           return sector
//         }),
//     [data]
//   )

//   const dataColors = React.useMemo(
//     () =>
//       sortedData.map((sector: any) => {
//         return getDataColor(sector.performance)
//       }),
//     [sortedData]
//   )

//   React.useEffect(() => {
//     const ctx = canvasRef.current.getContext('2d')

//     chartRef.current = new Chart(ctx, {
//       type: 'doughnut',
//       plugins: [
//         {
//           afterUpdate: (chart: any) => {
//             const items = chart.options.plugins.legend.labels.generateLabels(chart)
//             setLabels(items)
//           },
//         },
//       ],
//       data: {
//         labels: sortedData.map((sector: any) => sector.name),
//         datasets: [
//           {
//             data: sortedData.map((sector: any) => sector.marketCap),
//             backgroundColor: dataColors,
//             hoverBackgroundColor: dataColors,
//             borderColor: theme.palette.secondary.main,
//             borderWidth: 2,
//             hoverOffset: 6,
//           },
//         ],
//       },
//       options: {
//         plugins: {
//           tooltip: {
//             callbacks: {
//               label: (context: any) => {
//                 const value = sortedData[context.dataIndex].performance
//                 return `${context.label}: ${value}%`
//               },
//             },
//           },
//           legend: {
//             display: false,
//           },
//         },
//       },
//     } as any)

//     return () => {
//       chartRef.current!.destroy()
//     }
//   }, [])

//   return (
//     <div className={classes.flexContainer}>
//       <div>
//         <canvas id='sectors-chart' ref={canvasRef} />
//       </div>
//       <div>
//         {labels && labels.length && (
//           <List dense disablePadding>
//             {labels.map((item, index) => (
//               <div
//                 key={item.text}
//                 style={{
//                   borderRight: `4px solid ${item.fillStyle}`,
//                   // marginTop: 2,
//                   // marginBottom: 2,
//                 }}
//               >
//                 <ListItem
//                   divider
//                   disableGutters
//                   style={{
//                     paddingTop: 0,
//                     paddingBottom: 0,
//                     marginTop: 2,
//                     marginBottom: 2,
//                   }}
//                 >
//                   <ListItemText
//                     primary={item.text}
//                     primaryTypographyProps={{
//                       variant: 'caption',
//                       noWrap: true,
//                       style: {
//                         maxWidth: 120,
//                       },
//                     }}
//                   />
//                   <ListItemText
//                     primary={`${sortedData[index].performance}%`}
//                     primaryTypographyProps={{
//                       variant: 'caption',
//                       align: 'right',
//                       style: { paddingRight: 12 },
//                     }}
//                   />
//                 </ListItem>
//               </div>
//             ))}
//           </List>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ({ theme }: any) => {

//   const { isSuccess, data } = useQuery<AxiosResponse<any>, Error>('/sector-performance')

//   return !isSuccess ? (
//     <Skeleton variant="rectangular" height={360} />
//   ) : (
//     <StyledDoughnutChart theme={theme} classes={classes} data={data!.data} />
//   );
// }
export default {}
