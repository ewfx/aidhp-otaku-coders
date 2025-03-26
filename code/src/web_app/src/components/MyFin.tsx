import { useEffect, useState } from "react";
import { User } from "../types/auth"
import { SpendData } from "../types/spend";
import { getSpendsChartData } from "../api/spends";
import { getLoanRecommendations } from "../api/financial_products";
import { Loan } from "../types/financial_product";
import PieChartDisplay from "./PieChartDisplay";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

function MyFin({user}: {user: User|null}) {
    const [graphData, setGraphData] = useState<SpendData|null>(null);
    const [loanRecs, setLoanRecs] = useState<Loan[]|null>(null);

    useEffect(() => {
        const getGraphData = async () => {
            const res = await getSpendsChartData(user?.id as number);
            const jsonRes = await res.json() as SpendData;

            setGraphData(jsonRes);
        }
        const getLoanRecs = async () => {
            const res = await getLoanRecommendations(user?.id as number);
            const jsonRes = await res.json();
            
            setLoanRecs(jsonRes);
        }
        if(user) {
            getGraphData();
            getLoanRecs();
        }
    }, [user])



    const pieData1 = graphData?.category.map((spend, index) => ({
        name: spend.category,
        value: parseFloat(spend.spend.toFixed(3)),
        color: COLORS[index % COLORS.length]
    }));

    const pieData2 = graphData?.payment_mode.map((spend, index) => ({
        name: spend.mode,
        value: parseFloat(spend.spend.toFixed(3)),
        color: COLORS[index % COLORS.length]
    }));


    return (
        <>
            <h1 className="customer-portal-heading">MyFin: My Financials</h1>
            <div className="portal-container">
                <PieChartDisplay 
                    heading="Your Spends" 
                    description="Your spends this month, by category and payment method" 
                    pieData1={pieData1} 
                    pieData2={pieData2}
                />
                <div className="portal-chat">
                    <h2>Financial Tips</h2>
                    <p>Generated by AI ✨</p>
                    <h3>Loan Recommendations</h3>
                    <span>Based on your spends and profile, we recommend the following loans:</span>
                    <div className="product-carousel">
                        {loanRecs?.map((loan) => (
                        <div className="product-card bigger">
                            <h4>{loan.loan_type_readable}</h4>
                            <p>{loan.purchase_category}</p>
                            <span>Processing Fee: ${loan.processing_fee}</span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyFin