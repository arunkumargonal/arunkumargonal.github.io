import React, { useState, useMemo } from 'react';

// --- Reusable UI Components ---

const NotesSection = ({ notes, isVisible }) => (
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-sm text-blue-800 mb-2">Compliance Notes</h4>
            <ul className="space-y-3">
                {notes.map((note, index) => (
                    <li key={index} className="flex items-start text-sm text-blue-900/90">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A.75.75 0 0 0 10 12.5a.75.75 0 0 0 .75-.75v-.634a.25.25 0 0 1 .244-.304l.459-2.066A.75.75 0 0 0 10 8.25H9Z" clipRule="evenodd" /></svg>
                        <span dangerouslySetInnerHTML={{ __html: note }} />
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const PointsDisplay = ({ achieved, max }) => (
    <div className="absolute top-4 right-4 bg-green-100 text-green-800 rounded-lg p-2 flex flex-col items-center justify-center w-24 h-[72px]">
        <span className="font-bold text-sm -mb-1">Points</span>
        <div className="flex items-baseline">
            <span className="text-3xl font-extrabold">{achieved}</span>
            <span className="text-xl font-bold text-green-600/80">/{max}</span>
        </div>
    </div>
);

const CreditVisualizer = ({ thresholds, calculatedPoints, pointsLabel = "Points" }) => (
    <div className="w-full">
        <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">Points Summary</h3>
        <div className="flex w-full rounded-lg border-2 border-gray-200 overflow-hidden shadow-inner bg-gray-50">
            {thresholds.map((level, index) => {
                const isAchieved = level.points <= calculatedPoints;
                const isCurrent = level.points === calculatedPoints;
                return (
                    <div key={level.points} className={`flex-1 p-3 text-center transition-all duration-300 ${index < thresholds.length - 1 ? 'border-r-2 border-gray-200' : ''} ${isCurrent ? 'bg-green-200 scale-105 shadow-lg z-10' : isAchieved ? 'bg-green-50' : 'bg-gray-50 opacity-60'}`}>
                        <div className={`text-xs md:text-sm font-semibold ${isAchieved ? 'text-green-800' : 'text-gray-500'}`}>{level.label}</div>
                        <div className={`text-2xl md:text-3xl font-bold mt-1 ${isAchieved ? 'text-green-900' : 'text-gray-600'}`}>{level.points}</div>
                    </div>
                );
            })}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">{pointsLabel}</p>
    </div>
);

const LpdPercentageVisualizer = ({ values, baselines }) => {
    const areas = Object.keys(baselines);
    const reductionData = useMemo(() => areas.map(area => {
        const baselineValue = baselines[area];
        const actualValue = parseFloat(values[area]) || 0;
        const reduction = baselineValue > 0 ? ((baselineValue - actualValue) / baselineValue) * 100 : 0;
        return { area, baselineValue, actualValue, reduction };
    }), [values, baselines, areas]);
    return (
        <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">Performance Breakdown</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg"><table className="min-w-full text-sm text-center"><thead className="bg-gray-100"><tr><th className="p-2 font-semibold text-gray-600">Area</th><th className="p-2 font-semibold text-gray-600">Baseline</th><th className="p-2 font-semibold text-gray-600">Actual</th><th className="p-2 font-semibold text-gray-600">Reduction</th></tr></thead><tbody className="bg-white">{reductionData.map(({ area, baselineValue, actualValue, reduction }) => {let rC='text-gray-700';if(reduction>=30)rC='text-green-600 font-bold';else if(reduction>=25)rC='text-yellow-600 font-semibold';return(<tr key={area} className="border-t border-gray-200"><td className="p-2 font-semibold capitalize">{area}</td><td className="p-2 font-mono text-gray-500">{baselineValue.toFixed(2)}</td><td className="p-2 font-mono text-blue-600">{actualValue.toFixed(2)}</td><td className={`p-2 font-mono ${rC}`}>{reduction.toFixed(1)}%</td></tr>);})}</tbody></table></div>
        </div>
    );
};

const SourceToggle = ({ source, onSourceChange }) => (
    <div className="flex bg-gray-200 rounded-md p-0.5">
        <button onClick={() => onSourceChange('sdplus')} className={`px-3 py-1 text-xs font-semibold rounded ${source === 'sdplus' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>SD+</button>
        <button onClick={() => onSourceChange('custom')} className={`px-3 py-1 text-xs font-semibold rounded ${source === 'custom' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Custom</button>
    </div>
);

// --- Card Components ---

const CardShell = ({ children, notes }) => {
    const [notesVisible, setNotesVisible] = useState(false);
    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-grow flex flex-col">{children}</div>
            {notes && notes.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                    <button onClick={() => setNotesVisible(!notesVisible)} className="w-full flex justify-between items-center text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                        <span>Compliance Notes</span>
                        <svg className={`w-5 h-5 transition-transform ${notesVisible ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                    </button>
                    <NotesSection notes={notes} isVisible={notesVisible} />
                </div>
            )}
        </div>
    );
};

const BuildingEnvelopeCard = ({ retvConfig, uValueConfig, notes, values, onValueChange, onSourceChange }) => {
    const retvPoints = useMemo(() => retvConfig.calculationFn(values.retv), [values.retv, retvConfig]);
    const uValuePoints = useMemo(() => uValueConfig.calculationFn(values.uValue), [values.uValue, uValueConfig]);

    return (
        <CardShell notes={notes}>
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 text-sm">{retvConfig.inputLabel}</h3>
                                <SourceToggle source={values.retvSource} onSourceChange={(val) => onSourceChange('retvSource', val)} />
                            </div>
                            <div className="relative">
                                <input type="text" value={values.retv} disabled={values.retvSource === 'sdplus'} onChange={(e) => onValueChange('retv', e.target.value)} className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" />
                                {retvConfig.inputUnit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{retvConfig.inputUnit}</span>}
                            </div>
                        </div>
                        <CreditVisualizer thresholds={retvConfig.thresholds} calculatedPoints={retvPoints} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 text-sm">{uValueConfig.inputLabel}</h3>
                                <SourceToggle source={values.uValueSource} onSourceChange={(val) => onSourceChange('uValueSource', val)} />
                            </div>
                            <div className="relative">
                                <input type="text" value={values.uValue} disabled={values.uValueSource === 'sdplus'} onChange={(e) => onValueChange('uValue', e.target.value)} className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" />
                                {uValueConfig.inputUnit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{uValueConfig.inputUnit}</span>}
                            </div>
                        </div>
                        <CreditVisualizer thresholds={uValueConfig.thresholds} calculatedPoints={uValuePoints} />
                    </div>
                </div>
            </div>
        </CardShell>
    );
};

const LpdCreditCard = ({ calculationFn, thresholds, baselines, notes, values, onValueChange, onSourceChange }) => {
    const calculatedPoints = useMemo(() => calculationFn(values.lpd, baselines), [values, baselines, calculationFn]);
    return (
        <CardShell notes={notes}>
            <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">Credit Inputs</h3>
                    <SourceToggle source={values.lpdSource} onSourceChange={(val) => onSourceChange('lpdSource', val)} />
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="w-full grid grid-cols-2 gap-3 self-start">
                            {Object.keys(baselines).map(area => (
                                <div key={area} className="space-y-1">
                                    <h3 className="font-semibold text-gray-700 text-xs text-center capitalize">{area}</h3>
                                    <input name={area} type="text" value={values.lpd[area]} disabled={values.lpdSource === 'sdplus'} onChange={(e) => onValueChange(area, e.target.value)} className="w-full text-center text-base px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                             <CreditVisualizer thresholds={thresholds} calculatedPoints={calculatedPoints} />
                        </div>
                    </div>
                    <LpdPercentageVisualizer values={values.lpd} baselines={baselines} />
                </div>
            </div>
        </CardShell>
    );
};

const SelectionCreditCard = ({ calculationFn, options, value, onValueChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
            <div className="flex flex-col items-center gap-4 mt-2 flex-grow justify-center">
                <h3 className="font-semibold text-gray-700 text-sm text-center">Select AC Rating</h3>
                <div className="w-full flex flex-col space-y-2">
                    {options.map(option => { 
                        const isActive = value === option.value; 
                        return (
                            <button key={option.value} onClick={() => onValueChange(option.value)} className={`w-full p-3 rounded-lg transition-all duration-200 border-2 ${isActive ? 'bg-green-100 border-green-400 shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                <div className="flex justify-between items-center w-full">
                                    <span className={`font-semibold ${isActive ? 'text-green-800' : 'text-gray-700'}`}>{option.label}</span>
                                    <span className={`font-bold text-base px-2 py-0.5 rounded-md ${isActive ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-800'}`}>{option.points}</span>
                                </div>
                            </button>
                        ); 
                    })}
                </div>
            </div>
        </div>
    </CardShell>
);

const MultiSelectionCreditCard = ({ options, values, onValueChange, onSourceChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Credit Inputs</h3>
                <SourceToggle source={values.lightingControlsSource} onSourceChange={(val) => onSourceChange('lightingControlsSource', val)} />
            </div>
            <div className="flex flex-col items-center gap-3 mt-2 flex-grow justify-center">
                <p className="text-sm text-center text-gray-600 bg-gray-100 p-2 rounded-lg w-full"><strong>Earn 1 point</strong> by selecting at least one control for all non-emergency exterior and common areas.</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {options.map(option => { 
                        const isSelected = !!values.lightingControls[option.id]; 
                        return (
                            <label key={option.id} className={`p-2 h-full rounded-lg transition-all duration-200 border-2 flex items-center justify-center text-center cursor-pointer ${isSelected ? 'bg-green-100 border-green-400 shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                <input type="checkbox" checked={isSelected} disabled={values.lightingControlsSource === 'sdplus'} onChange={() => onValueChange(option.id)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                <span className={`ml-2 font-semibold text-sm ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{option.label}</span>
                            </label>
                        ); 
                    })}
                </div>
            </div>
        </div>
    </CardShell>
);

const ConditionalCreditCard = ({ applicability, conditions, values, onValueChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
            <div className="flex flex-col items-start gap-4 mt-2 flex-grow justify-center">
                <label className="w-full p-3 rounded-lg bg-yellow-50 border-2 border-yellow-200 flex items-center cursor-pointer">
                    <input type="checkbox" checked={values.isApplicable} onChange={() => onValueChange('isApplicable', !values.isApplicable)} className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                    <span className="ml-3 font-semibold text-yellow-800 text-sm">{applicability.label}</span>
                </label>
                <div className={`w-full space-y-2 transition-opacity duration-300 ${values.isApplicable ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <p className="text-sm text-center text-gray-600">If applicable, <strong>both</strong> conditions below must be met to earn <strong>1 point</strong>.</p>
                    {conditions.map(cond => (
                        <label key={cond.id} className={`w-full p-3 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${values.subConditions[cond.id] ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}>
                            <input type="checkbox" checked={values.subConditions[cond.id]} onChange={() => onValueChange('subCondition', cond.id)} disabled={!values.isApplicable} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                            <span className="ml-3 text-sm font-semibold text-gray-700">{cond.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </CardShell>
);

// --- Accordion Component ---
const Accordion = ({ title, points, maxPoints, isOpen, onToggle, children }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={onToggle} className={`w-full flex justify-between items-center p-4 text-left transition-colors ${isOpen ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
            <span className="font-bold text-base text-green-800">{title}</span>
            <div className="flex items-center">
                <div className="flex items-baseline bg-white/60 rounded-lg px-3 py-1 mr-4">
                    <span className="text-2xl font-extrabold text-green-700">{points}</span>
                    <span className="text-lg font-bold text-green-600/80">/{maxPoints}</span>
                </div>
                <svg className={`w-6 h-6 transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="p-6 bg-white border-t border-gray-200">
                {children}
            </div>
        </div>
    </div>
);


// --- Approach Components ---

const PrescriptiveApproach = ({ values, onValueChange, onSourceChange, credits }) => {
    const [openAccordion, setOpenAccordion] = useState('envelope');

    const handleToggle = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    const points = useMemo(() => ({
        envelope: credits.buildingEnvelope.retvConfig.calculationFn(values.retv) + credits.buildingEnvelope.uValueConfig.calculationFn(values.uValue),
        lpd: credits.lpd.calculationFn(values.lpd, credits.lpd.baselines),
        ac: credits.ac.calculationFn(values.ac),
        lighting: credits.lightingControls.calculationFn(values.lightingControls),
        heating: credits.spaceHeating.calculationFn(values.spaceHeating.isApplicable, values.spaceHeating.subConditions)
    }), [values, credits]);

    return (
        <div className="space-y-4">
            <Accordion title="1. Building Envelope" points={points.envelope} maxPoints={7} isOpen={openAccordion === 'envelope'} onToggle={() => handleToggle('envelope')}>
                <BuildingEnvelopeCard values={values} onValueChange={(key, val) => onValueChange('buildingEnvelope', key, val)} onSourceChange={(key, val) => onSourceChange('buildingEnvelope', key, val)} {...credits.buildingEnvelope} />
            </Accordion>
            <Accordion title="2. Lighting Power Density (LPD)" points={points.lpd} maxPoints={2} isOpen={openAccordion === 'lpd'} onToggle={() => handleToggle('lpd')}>
                <LpdCreditCard values={values} onValueChange={(key, val) => onValueChange('lpd', key, val)} onSourceChange={(key, val) => onSourceChange('lpd', key, val)} {...credits.lpd} />
            </Accordion>
            <Accordion title="3. Air Conditioning Systems" points={points.ac} maxPoints={2} isOpen={openAccordion === 'ac'} onToggle={() => handleToggle('ac')}>
                 <SelectionCreditCard value={values.ac} onValueChange={(val) => onValueChange('ac', val)} {...credits.ac} />
            </Accordion>
            <Accordion title="4. Lighting Controls" points={points.lighting} maxPoints={1} isOpen={openAccordion === 'lighting'} onToggle={() => handleToggle('lighting')}>
                <MultiSelectionCreditCard values={values} onValueChange={(key) => onValueChange('lightingControls', key)} onSourceChange={(key, val) => onSourceChange('lightingControls', key, val)} {...credits.lightingControls} />
            </Accordion>
            <Accordion title="5. Space Heating Systems" points={points.heating} maxPoints={1} isOpen={openAccordion === 'heating'} onToggle={() => handleToggle('heating')}>
                 <ConditionalCreditCard values={values.spaceHeating} onValueChange={(key, val) => onValueChange('spaceHeating', key, val)} {...credits.spaceHeating} />
            </Accordion>
        </div>
    );
};

const SimulationApproach = ({ values, onValueChange, points, notes }) => {
    const thresholds = [
        { points: 1, label: '2.5%' }, { points: 2, label: '5%' }, { points: 3, label: '7.5%' },
        { points: 4, label: '10%' }, { points: 5, label: '12.5%' }, { points: 6, label: '15%' },
        { points: 7, label: '17.5%' }, { points: 8, label: '20%' }, { points: 9, label: '22.5%' },
        { points: 10, label: '25%' }
    ];

    return (
        <CardShell notes={notes}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg md:col-span-1">
                    <h3 className="font-semibold text-gray-700 text-sm text-center">Energy Savings Percentage (Simulation Result)</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={values.energySavings} 
                            onChange={(e) => onValueChange('energySavings', e.target.value)} 
                            className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <CreditVisualizer thresholds={thresholds} calculatedPoints={points} pointsLabel="% Improvement" />
                </div>
            </div>
        </CardShell>
    );
};

const CreditDetailPage = ({ onBack, values, onValueChange, onSourceChange, credits, approach, onApproachChange, totalPoints }) => {
    const displayTotal = Math.min(totalPoints, 10);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-1: Enhanced Energy Performance</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{displayTotal}</span>
                        <span className="text-3xl font-semibold opacity-80">/10</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center bg-gray-200 rounded-lg p-1">
                <button onClick={() => onApproachChange('prescriptive')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'prescriptive' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Prescriptive Approach</button>
                <button onClick={() => onApproachChange('simulation')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'simulation' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Simulation Approach</button>
            </div>
            {approach === 'prescriptive' ? (
                <PrescriptiveApproach values={values} onValueChange={onValueChange} onSourceChange={onSourceChange} credits={credits} />
            ) : (
                <SimulationApproach values={values.simulation} onValueChange={(key, val) => onValueChange('simulation', key, val)} points={displayTotal} notes={credits.simulation.notes} />
            )}
        </div>
    );
};

const NextPointInsight = ({ delta, unit }) => {
    if (delta <= 0) return null;

    return (
        <div className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg text-indigo-800 flex items-center space-x-3 mt-2">
            <svg className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A.75.75 0 0 0 10 12.5a.75.75 0 0 0 .75-.75v-.634a.25.25 0 0 1 .244-.304l.459-2.066A.75.75 0 0 0 10 8.25H9Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">
                <strong>Next Point Insight:</strong> Provide <strong>{delta.toFixed(0)} more {unit}</strong> to achieve 1 more point.
            </p>
        </div>
    );
};

const AlternateWaterHeatingPage = ({ onBack, values, onValueChange, onSourceChange, credit }) => {
    const { residents, alternateLitres, technologies, alternateLitresSource } = values;
    
    const totalRequirement = useMemo(() => (parseInt(residents) || 0) * 20, [residents]);
    const percentageMet = useMemo(() => {
        const altL = parseFloat(alternateLitres) || 0;
        return totalRequirement > 0 ? (altL / totalRequirement) * 100 : 0;
    }, [alternateLitres, totalRequirement]);

    const calculatedPoints = useMemo(() => credit.calculationFn(percentageMet, technologies), [percentageMet, technologies, credit]);

    const dynamicThresholds = useMemo(() => {
        return credit.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredLitres = (totalRequirement * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredLitres.toFixed(0)} L)` }
        })
    }, [totalRequirement, credit.thresholds]);
    
    const nextPointDelta = useMemo(() => {
        if (calculatedPoints >= 3) return 0;
        const nextThreshold = credit.thresholds.find(t => t.points === calculatedPoints + 1);
        if (!nextThreshold) return 0;
        const nextPercentage = parseFloat(nextThreshold.label);
        const requiredLitres = (totalRequirement * nextPercentage) / 100;
        const currentLitres = parseFloat(alternateLitres) || 0;
        const delta = requiredLitres - currentLitres;
        return delta > 0 ? delta : 0;
    }, [calculatedPoints, credit.thresholds, totalRequirement, alternateLitres]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-2: Alternate Water Heating Systems</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/3</span></div></div></div>
            <CardShell notes={credit.notes}>
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-gray-600 block">Hot Water from Alternate Systems (Litres/day)</label>
                                        <SourceToggle source={alternateLitresSource} onSourceChange={(val) => onSourceChange('waterHeating', 'alternateLitresSource', val)} />
                                    </div>
                                    <input type="text" value={alternateLitres} disabled={alternateLitresSource === 'sdplus'} onChange={e => onValueChange('waterHeating', 'alternateLitres', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                </div>
                                <NextPointInsight delta={nextPointDelta} unit="Litres/day" />
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <CreditVisualizer thresholds={dynamicThresholds} calculatedPoints={calculatedPoints} pointsLabel="Target Litres/day" />
                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-800">Percentage Met</p>
                                    <p className="text-3xl font-bold text-blue-900">{percentageMet.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                         <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Number of Residents</label>
                                <input type="text" value={residents} onChange={e => onValueChange('waterHeating', 'residents', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                <p className="text-sm text-gray-500 mt-1">Total Requirement: <strong className="font-mono">{totalRequirement.toFixed(0)} L/day</strong></p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-600 block mb-1">Technology Used</h4>
                                {credit.options.map(opt => (<label key={opt.id} className={`w-full p-2 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${technologies[opt.id] ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}><input type="checkbox" checked={!!technologies[opt.id]} onChange={() => onValueChange('waterHeating', 'technologies', opt.id)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-3 font-semibold text-gray-700 text-sm">{opt.label}</span></label>))}
                            </div>
                         </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};

const OnSiteRenewableEnergyPage = ({ onBack, values, onValueChange, onSourceChange, credit }) => {
    const { totalConsumption, renewableGeneration, renewableGenerationSource } = values;
    
    const percentageMet = useMemo(() => {
        const total = parseFloat(totalConsumption) || 0;
        const renewable = parseFloat(renewableGeneration) || 0;
        return total > 0 ? (renewable / total) * 100 : 0;
    }, [totalConsumption, renewableGeneration]);

    const calculatedPoints = useMemo(() => credit.calculationFn(percentageMet), [percentageMet, credit]);

    const dynamicThresholds = useMemo(() => {
        return credit.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredKwh = ((parseFloat(totalConsumption) || 0) * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredKwh.toFixed(0)} kWh)` };
        });
    }, [totalConsumption, credit.thresholds]);

    const nextPointDelta = useMemo(() => {
        if (calculatedPoints >= 4) return 0;
        const nextThreshold = credit.thresholds.find(t => t.points === calculatedPoints + 1);
        if (!nextThreshold) return 0;
        const nextPercentage = parseFloat(nextThreshold.label);
        const requiredKwh = ((parseFloat(totalConsumption) || 0) * nextPercentage) / 100;
        const currentKwh = parseFloat(renewableGeneration) || 0;
        const delta = requiredKwh - currentKwh;
        return delta > 0 ? delta : 0;
    }, [calculatedPoints, credit.thresholds, totalConsumption, renewableGeneration]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-3: On-site Renewable Energy - Common Lighting</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/4</span></div></div></div>
            <CardShell notes={credit.notes}>
                 <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-gray-600 block">On-site Renewable Energy Generation (kWh/year)</label>
                                        <SourceToggle source={renewableGenerationSource} onSourceChange={(val) => onSourceChange('renewableEnergy', 'renewableGenerationSource', val)} />
                                    </div>
                                    <input type="text" value={renewableGeneration} disabled={renewableGenerationSource === 'sdplus'} onChange={e => onValueChange('renewableEnergy', 'renewableGeneration', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                </div>
                                <NextPointInsight delta={nextPointDelta} unit="kWh/year" />
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <CreditVisualizer thresholds={dynamicThresholds} calculatedPoints={calculatedPoints} pointsLabel="Target kWh/year" />
                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-800">Percentage Met</p>
                                    <p className="text-3xl font-bold text-blue-900">{percentageMet.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Total Annual Common Lighting Consumption (kWh/year)</label>
                            <input type="text" value={totalConsumption} onChange={e => onValueChange('renewableEnergy', 'totalConsumption', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};

const CommonAreaEquipmentPage = ({ onBack, values, onValueChange, credit }) => {
    const calculatedPoints = useMemo(() => credit.calculationFn(values), [values, credit]);

    const renderSubOptions = (mainSelection, subOptions, name, currentSelection) => (
        <div className={`pl-8 mt-3 space-y-2 transition-all duration-300 ${mainSelection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {subOptions.map(opt => (
                <label key={opt.id} className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={!!currentSelection[opt.id]} 
                        onChange={() => onValueChange('commonEquipment', name, opt.id)} 
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );
    
    const renderLiftOptions = (mainSelection, subOptions, name, currentSelection) => (
         <div className={`pl-8 mt-3 space-y-2 transition-all duration-300 ${mainSelection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {subOptions.map(opt => (
                <label key={opt.id} className="flex items-center cursor-pointer"><input type="radio" name={name} value={opt.id} checked={currentSelection === opt.id} onChange={(e) => onValueChange('commonEquipment', 'liftType', e.target.value)} className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-3 text-sm text-gray-700">{opt.label}</span></label>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-4: Energy Efficiency in Common Area Equipment</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/1</span></div></div></div>
            <CardShell notes={credit.notes}>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                    <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg">Provide any <strong>two</strong> of the following measures to earn <strong>1 point</strong>.</p>
                    <div className="space-y-4 mt-4">
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.pumps.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.pumps.selected} onChange={() => onValueChange('commonEquipment', 'pumps', { ...values.pumps, selected: !values.pumps.selected })} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Pumps</span></label>{renderSubOptions(values.pumps.selected, credit.pumpOptions, 'pumpType', values.pumps.types)}</div>
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.motors.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.motors.selected} onChange={() => onValueChange('commonEquipment', 'motors', { ...values.motors, selected: !values.motors.selected })} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Motors</span></label>{renderSubOptions(values.motors.selected, credit.motorOptions, 'motorType', values.motors.types)}</div>
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.lifts.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.lifts.selected} onChange={() => onValueChange('commonEquipment', 'lifts', { ...values.lifts, selected: !values.lifts.selected })} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Efficient Lifts & Escalators</span></label>{renderLiftOptions(values.lifts.selected, credit.liftOptions, 'liftType', values.lifts.type)}</div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};

const EnergyMonitoringPage = ({ onBack, values, onValueChange, credit }) => {
    const { caseA, caseB, approach } = values;
    const calculatedPoints = useMemo(() => credit.calculationFn(values), [values, credit]);

    const renderChecklist = (options, selection, name) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map(opt => (
                <label key={opt.id} className={`p-3 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${selection[opt.id] ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}>
                    <input type="checkbox" checked={!!selection[opt.id]} onChange={() => onValueChange('energyMonitoring', name, opt.id)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-3 text-sm font-semibold text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-5: Integrated Energy Monitoring System</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/2</span></div></div></div>
            <CardShell notes={credit.notes}>
                 <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                    <div className="flex justify-center bg-gray-200 rounded-lg p-1 mb-4">
                        <button onClick={() => onValueChange('energyMonitoring', 'approach', 'A')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'A' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case A: Energy Metering</button>
                        <button onClick={() => onValueChange('energyMonitoring', 'approach', 'B')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'B' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case B: Building Management System</button>
                    </div>
                    {approach === 'A' ? (
                        <div>
                            <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg mb-4">Provide energy meters for <strong>any four</strong> of the following to get <strong>1 point</strong> (max. 2 points).</p>
                            {renderChecklist(credit.caseAOptions, caseA, 'caseA')}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg mb-4">Integrate <strong>any two</strong> measures with BMS to get <strong>1 point</strong> (max. 2 points).</p>
                            {renderChecklist(credit.caseBOptions, caseB, 'caseB')}
                        </div>
                    )}
                </div>
            </CardShell>
        </div>
    );
};


const LandingPage = ({ onNavigate, points }) => {
    const creditsList = [
        { id: 'ee-cr-1', title: 'Enhanced Energy Performance', maxPoints: 10, points: points.eeCr1, active: true },
        { id: 'ee-cr-2', title: 'Alternate Water heating Systems', maxPoints: 3, points: points.eeCr2, active: true },
        { id: 'ee-cr-3', title: 'On-site Renewable Energy – Common Lighting', maxPoints: 4, points: points.eeCr3, active: true },
        { id: 'ee-cr-4', title: 'Energy efficiency in common area equipment', maxPoints: 1, points: points.eeCr4, active: true },
        { id: 'ee-cr-5', title: 'Integrated Energy Monitoring System', maxPoints: 2, points: points.eeCr5, active: true },
    ];
    
    const totalCategoryPoints = creditsList.reduce((acc, credit) => acc + credit.points, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
             <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg mb-4">
                <h2 className="text-xl font-bold mb-2 md:mb-0">Energy Efficiency Category</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Category Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalCategoryPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/20</span>
                    </div>
                </div>
            </div>
             <div className="space-y-3">
                {creditsList.map(credit => (
                    <button 
                        key={credit.id}
                        onClick={() => credit.active && onNavigate(credit.id)}
                        disabled={!credit.active}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center ${credit.active ? 'border-transparent bg-green-50 hover:bg-green-100 hover:shadow-md cursor-pointer' : 'border-transparent bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                    >
                        <div className="text-left">
                            <p className="font-bold text-green-800">{credit.id.toUpperCase().replace(/-/g, ' ')}</p>
                            <p className={`font-semibold ${credit.active ? 'text-gray-800' : 'text-gray-500'}`}>{credit.title}</p>
                        </div>
                        <div className="flex items-baseline bg-white/60 rounded-lg px-4 py-2">
                            <span className="text-3xl font-extrabold text-green-700">{credit.points}</span>
                            <span className="text-xl font-bold text-green-600/80">/{credit.maxPoints}</span>
                        </div>
                    </button>
                ))}
             </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
    const [currentPage, setCurrentPage] = useState('landing');
    const [approach, setApproach] = useState('prescriptive');
    
    const sdPlusValues = useMemo(() => ({
        retv: "12.5",
        uValue: "1.0",
        lpd: { interior: '3.5', exterior: '1.5', common: '2.5', parking: '1.5' },
        lightingControls: 'daylight',
        alternateLitres: '200',
        renewableGeneration: '3000'
    }), []);

    const [values, setValues] = useState({
        retv: sdPlusValues.retv,
        retvSource: 'sdplus',
        uValue: sdPlusValues.uValue,
        uValueSource: 'sdplus',
        lpd: sdPlusValues.lpd,
        lpdSource: 'sdplus',
        ac: '5-star',
        lightingControls: { [sdPlusValues.lightingControls]: true },
        lightingControlsSource: 'sdplus',
        spaceHeating: { isApplicable: false, subConditions: { heatPump: false, thermal: false } },
        simulation: { energySavings: '10' },
        waterHeating: { 
            residents: '10', 
            alternateLitres: sdPlusValues.alternateLitres,
            alternateLitresSource: 'sdplus',
            technologies: { solar: true } 
        },
        renewableEnergy: { 
            totalConsumption: '10000', 
            renewableGeneration: sdPlusValues.renewableGeneration,
            renewableGenerationSource: 'sdplus'
        },
        commonEquipment: { pumps: {selected: true, types: {bee4star: true}}, motors: {selected: false, types: {}}, lifts: {selected: true, type: 'regenerative'} },
        energyMonitoring: { approach: 'A', caseA: { commonLighting: true, exteriorLighting: true, lifts: true, stp: true}, caseB: {} }
    });

    const handleValueChange = (card, key, value) => {
        setValues(prev => {
            const newState = { ...prev };
            if (card === 'buildingEnvelope') { newState[key] = value; } 
            else if (card === 'lpd') { if (/^\d*\.?\d*$/.test(value)) newState.lpd = { ...prev.lpd, [key]: value }; } 
            else if (card === 'ac') { newState.ac = value; } 
            else if (card === 'lightingControls') { newState.lightingControls = { ...prev.lightingControls, [key]: !prev.lightingControls[key] }; } 
            else if (card === 'spaceHeating') {
                if (key === 'isApplicable') { newState.spaceHeating = { ...prev.spaceHeating, isApplicable: value }; } 
                else { newState.spaceHeating = { ...prev.spaceHeating, subConditions: { ...prev.spaceHeating.subConditions, [value]: !prev.spaceHeating.subConditions[value] } }; }
            } else if (card === 'simulation') { 
                if (/^\d*\.?\d*$/.test(value)) newState.simulation = { ...prev.simulation, [key]: value }; 
            }
            else if (card === 'waterHeating') {
                if (key === 'technologies') { newState.waterHeating.technologies = { ...prev.waterHeating.technologies, [value]: !prev.waterHeating.technologies[value] }; }
                else if (/^\d*\.?\d*$/.test(value) || value === '') { newState.waterHeating[key] = value; }
            } else if (card === 'renewableEnergy') {
                if (/^\d*\.?\d*$/.test(value) || value === '') { newState.renewableEnergy = { ...prev.renewableEnergy, [key]: value }; }
            } else if (card === 'commonEquipment') {
                const newEquipmentState = { ...prev.commonEquipment };
                if (key === 'pumps' || key === 'motors' || key === 'lifts') {
                    newEquipmentState[key] = value;
                } else if (key === 'pumpType' || key === 'motorType') {
                    const typeKey = key === 'pumpType' ? 'pumps' : 'motors';
                    const newTypes = { ...prev.commonEquipment[typeKey].types };
                    newTypes[value] = !newTypes[value];
                    newEquipmentState[typeKey] = { ...prev.commonEquipment[typeKey], types: newTypes };
                } else if (key === 'liftType') {
                    newEquipmentState.lifts = { ...prev.commonEquipment.lifts, type: value };
                }
                newState.commonEquipment = newEquipmentState;
            } else if (card === 'energyMonitoring') {
                const newMonitoringState = { ...prev.energyMonitoring };
                if (key === 'approach') { newMonitoringState.approach = value; }
                else if (key === 'caseA') { newMonitoringState.caseA = { ...prev.energyMonitoring.caseA, [value]: !prev.energyMonitoring.caseA[value] }; }
                else if (key === 'caseB') { newMonitoringState.caseB = { ...prev.energyMonitoring.caseB, [value]: !prev.energyMonitoring.caseB[value] }; }
                newState.energyMonitoring = newMonitoringState;
            }
            return newState;
        });
    };
    
    const handleSourceChange = (card, key, source) => {
        setValues(prev => {
            const newState = { ...prev };
            if (card === 'buildingEnvelope') {
                newState[key] = source;
                if (source === 'sdplus') {
                    const valueKey = key.replace('Source', '');
                    newState[valueKey] = sdPlusValues[valueKey];
                }
            } else if (card === 'lpd') {
                newState.lpdSource = source;
                if (source === 'sdplus') {
                    newState.lpd = sdPlusValues.lpd;
                }
            } else if (card === 'lightingControls') {
                newState.lightingControlsSource = source;
                if (source === 'sdplus') {
                    newState.lightingControls = { [sdPlusValues.lightingControls]: true };
                } else {
                    newState.lightingControls = {};
                }
            } else if (card === 'waterHeating') {
                newState.waterHeating.alternateLitresSource = source;
                if (source === 'sdplus') {
                    newState.waterHeating.alternateLitres = sdPlusValues.alternateLitres;
                }
            } else if (card === 'renewableEnergy') {
                newState.renewableEnergy.renewableGenerationSource = source;
                if (source === 'sdplus') {
                    newState.renewableEnergy.renewableGeneration = sdPlusValues.renewableGeneration;
                }
            }
            return newState;
        });
    };

    const credits = useMemo(() => ({
        eeCr1: {
            buildingEnvelope: { notes: [ "The project should design the building envelope measures as per Eco-Niwas Samhita 2018 (ECBC-R).", "Envelope optimization measures can be referred under National Building Code 2016-Chapter 11, No. 8- Envelope Optimisation." ], retvConfig: { inputLabel: "Project RETV (W/m²)", inputUnit: "W/m²", calculationFn: (v) => { const val=parseFloat(v); if(isNaN(val)) return 0; if(val<=13) return 5; if(val<=13.5) return 4; if(val<=14) return 3; if(val<=14.5) return 2; if(val<=15) return 1; return 0; }, thresholds: [{ points: 1, label: '≤ 15.0' }, { points: 2, label: '≤ 14.5' }, { points: 3, label: '≤ 14.0' }, { points: 4, label: '≤ 13.5' }, { points: 5, label: '≤ 13.0' }] }, uValueConfig: { inputLabel: "Roof U-Value (W/m²K)", inputUnit: "W/m²K", calculationFn: (v) => { const val=parseFloat(v); if(isNaN(val)) return 0; if(val<=1.0) return 2; if(val<=1.2) return 1; return 0; }, thresholds: [{ points: 1, label: '≤ 1.2' }, { points: 2, label: '≤ 1.0' }] } },
            lpd: { notes: [ "Projects should show compliance for all the areas which are in developer’s/ owner’s scope only.", "Compliance for interior, exterior, common and parking area lighting must be shown separately.", "Decorative lighting in respective areas should be considered for lighting power density calculations.", "Exterior areas illuminated by lighting only should be considered for lighting power density calculations." ], baselines: { interior: 5, exterior: 2.5, common: 4, parking: 2.5 }, calculationFn: (vals, baselines) => { const r = Object.keys(baselines).map(a => { const b = baselines[a]; const v = parseFloat(vals[a]); if(isNaN(v) || b === 0) return -1; return ((b - v) / b) * 100; }); if (r.some(v => v < 0)) return 0; if (r.every(v => v >= 30)) return 2; if (r.every(v => v >= 25)) return 1; return 0; }, thresholds: [ { points: 1, label: '≥ 25%' }, { points: 2, label: '≥ 30%' } ] },
            ac: { notes: [ "Applicable for project only if 25% of the total regularly occupied spaces are airconditioned, excluding kitchen & bathroom.", "Projects should show compliance for all the air-conditioning system(s) installed, within the owner’s/ developer’s scope.", "For latest list of air-conditioners rated by BEE, please refer BEE website: <a href='https://www.beestarlabel.com/' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:underline'>https://www.beestarlabel.com/</a>.", "Minimum Efficiency Requirements for VRF Systems can be referred from ASHRAE Standard 90.1-2016.", "BEE Star rating to be considered as per the latest notifications." ], options: [ { value: 'none', label: 'None / < 4-Star', points: 0 }, { value: '4-star', label: 'BEE 4-Star Rated', points: 1 }, { value: '5-star', label: 'BEE 5-Star / Inverter', points: 2 } ], calculationFn: (val) => { const selected = credits.eeCr1.ac.options.find(opt => opt.value === val); return selected ? selected.points : 0; } },
            lightingControls: { notes: [ "All non-emergency exterior & common area lighting such as façade, pathways, landscaping, surface and covered parking, street lighting, staircases should have atleast one of the lighting controls in common areas & common toilets." ], options: [ { id: 'daylight', label: 'Daylight Sensor' }, { id: 'occupancy', label: 'Occupancy/Motion Sensor' }, { id: 'timer', label: 'Timer Based Controls' } ], calculationFn: (selected) => { return Object.values(selected).some(isSelected => isSelected) ? 1 : 0; } },
            spaceHeating: { notes: [ "<strong>Degree day:</strong> The difference in temperature between the outdoor mean temperature over 24 hour period and a given base temperature.", "<strong>Heating degree day base 18°C, HDD 18:</strong> for any one day, when the mean temperature is less than 18°C, there are as many degree-days as degree Centigrade temperature difference between the mean temperature for the day and 18°C. Annual heating degree-days (HDDs) are the sum of the degree-days over the calendar year." ], applicability: { label: 'Applicable (HDD 18 > 150)' }, conditions: [ { id: 'heatPump', label: 'Unitary heat pumps meet ECBC-R / ECBC 2017 criteria' }, { id: 'thermal', label: 'Non-electricity heating has ≥ 70% thermal efficiency' } ], calculationFn: (isApplicable, subConditions) => { if (!isApplicable) return 0; const allMet = Object.values(subConditions).every(val => val === true); return allMet ? 1 : 0; } },
            simulation: { notes: [ "Projects having multiple building types must independently meet the minimum energy performance criteria to be eligible for Enhanced Energy Performance.", "Trade-offs among different building parameters (such as lighting, air-conditioning, etc.) are permissible.", "Projects which use on-site renewable energy sources (such as solar photovoltaics, wind turbines, etc.) can subtract the renewable energy generated from the total energy of the proposed case.", "Alternate hot water heating systems (Solar Hot water, LPG, Heat Pumps) should not be modeled in either the base case or the proposed case, to show energy savings." ] }
        },
        eeCr2: {
            notes: [ "The minimum hot water requirement for domestic purposes should be considered as 20 liters per person per day.", "The minimum temperature requirement of hot water to be considered for domestic applications can range between 35-40 deg C." ],
            options: [ { id: 'gas', label: 'Natural Gas (or) LPG based systems' }, { id: 'heatPump', label: 'Heat pump with minimum of COP 3.2' }, { id: 'solar', label: 'Solar water heating systems' } ],
            thresholds: [ { points: 1, label: '50%' }, { points: 2, label: '75%' }, { points: 3, label: '95%' } ],
            calculationFn: (percentage, technologies) => {
                const techSelected = Object.values(technologies).some(t => t);
                if (!techSelected) return 0;
                if (percentage >= 95) return 3;
                if (percentage >= 75) return 2;
                if (percentage >= 50) return 1;
                return 0;
            }
        },
        eeCr3: {
            notes: [ "Solar hot water systems cannot be considered as power generation source and cannot be subtracted from the total energy of the proposed case.", "Common area lighting requirements include lighting used in corridors, basements, parking, club house, landscaping and any other common areas under developer scope." ],
            thresholds: [ { points: 1, label: '25%' }, { points: 2, label: '50%' }, { points: 3, label: '75%' }, { points: 4, label: '95%' } ],
            calculationFn: (percentage) => {
                if (percentage >= 95) return 4;
                if (percentage >= 75) return 3;
                if (percentage >= 50) return 2;
                if (percentage >= 25) return 1;
                return 0;
            }
        },
        eeCr4: {
            notes: [],
            pumpOptions: [ {id: 'bee4star', label: 'BEE 4-star rated'}, {id: 'eff70', label: 'Min. 70% efficiency (>3 HP)'}, {id: 'isi', label: 'ISI certified (others)'} ],
            motorOptions: [ {id: 'bee4star', label: 'BEE 4-star rated'}, {id: 'eff85', label: 'Min. 85% efficiency (>3 HP)'}, {id: 'isi', label: 'ISI certified (others)'} ],
            liftOptions: [ {id: 'regenerative', label: 'Regenerative lifts'}, {id: 'doubleDeck', label: 'Double-deck elevators'}, {id: 'gearless', label: 'Gearless traction elevators'}, {id: 'machineRoomless', label: 'Machine-room less traction elevators'} ],
            calculationFn: (v) => {
                const pumpsMet = v.pumps.selected && Object.values(v.pumps.types).some(Boolean);
                const motorsMet = v.motors.selected && Object.values(v.motors.types).some(Boolean);
                const liftsMet = v.lifts.selected && v.lifts.type;
                const measuresMet = [pumpsMet, motorsMet, liftsMet].filter(Boolean).length;
                return measuresMet >= 2 ? 1 : 0;
            }
        },
        eeCr5: {
            notes: [],
            caseAOptions: [ {id: 'commonLighting', label: 'Common area lighting'}, {id: 'exteriorLighting', label: 'Exterior area lighting'}, {id: 'lifts', label: 'Energy meter for lifts'}, {id: 'stp', label: 'STP'}, {id: 'pumpsMotors', label: 'Pumps & motors'}, {id: 'clubHouse', label: 'Club house'}, {id: 'dgSet', label: 'DG set'}, {id: 'reGeneration', label: 'RE generation'}, {id: 'airConditioning', label: 'Air-conditioning'}, {id: 'treatedWater', label: 'Treated waste water pumping'}, {id: 'powerBackup', label: 'Power backup systems'}, {id: 'other', label: 'Any other energy consuming equipment'} ],
            caseBOptions: [ {id: 'acManagement', label: 'Air-conditioning management system'}, {id: 'lightingManagement', label: 'Lighting management system'}, {id: 'elevatorManagement', label: 'Elevator management system'}, {id: 'reManagement', label: 'Renewable energy management system'}, {id: 'cctv', label: 'CCTV'}, {id: 'waterLevel', label: 'Overhead water level indicators'}, {id: 'waterMetering', label: 'Water Metering (dwelling unit level)'} ],
            calculationFn: (v) => {
                if (v.approach === 'A') {
                    const count = Object.values(v.caseA).filter(Boolean).length;
                    return Math.min(Math.floor(count / 4), 2);
                } else {
                    const count = Object.values(v.caseB).filter(Boolean).length;
                    return Math.min(Math.floor(count / 2), 2);
                }
            }
        }
    }), []);

    const eeCr1Points = useMemo(() => {
        if (approach === 'prescriptive') {
            const c = credits.eeCr1;
            const envelopePoints = c.buildingEnvelope.retvConfig.calculationFn(values.retv) + c.buildingEnvelope.uValueConfig.calculationFn(values.uValue);
            const lpdPoints = c.lpd.calculationFn(values.lpd, c.lpd.baselines);
            const acPoints = c.ac.calculationFn(values.ac);
            const lightingPoints = c.lightingControls.calculationFn(values.lightingControls);
            const heatingPoints = c.spaceHeating.calculationFn(values.spaceHeating.isApplicable, values.spaceHeating.subConditions);
            return envelopePoints + lpdPoints + acPoints + lightingPoints + heatingPoints;
        } else { // Simulation
            const savings = parseFloat(values.simulation.energySavings) || 0;
            if (savings >= 25) return 10;
            if (savings >= 22.5) return 9;
            if (savings >= 20) return 8;
            if (savings >= 17.5) return 7;
            if (savings >= 15) return 6;
            if (savings >= 12.5) return 5;
            if (savings >= 10) return 4;
            if (savings >= 7.5) return 3;
            if (savings >= 5) return 2;
            if (savings >= 2.5) return 1;
            return 0;
        }
    }, [values, credits, approach]);

    const eeCr2Points = useMemo(() => {
        const { residents, alternateLitres, technologies } = values.waterHeating;
        const totalRequirement = (parseInt(residents) || 0) * 20;
        const percentageMet = totalRequirement > 0 ? ((parseFloat(alternateLitres) || 0) / totalRequirement) * 100 : 0;
        return credits.eeCr2.calculationFn(percentageMet, technologies);
    }, [values.waterHeating, credits.eeCr2]);

    const eeCr3Points = useMemo(() => {
        const { totalConsumption, renewableGeneration } = values.renewableEnergy;
        const total = parseFloat(totalConsumption) || 0;
        const renewable = parseFloat(renewableGeneration) || 0;
        const percentageMet = total > 0 ? (renewable / total) * 100 : 0;
        return credits.eeCr3.calculationFn(percentageMet);
    }, [values.renewableEnergy, credits.eeCr3]);

    const eeCr4Points = useMemo(() => credits.eeCr4.calculationFn(values.commonEquipment), [values.commonEquipment, credits.eeCr4]);
    
    const eeCr5Points = useMemo(() => credits.eeCr5.calculationFn(values.energyMonitoring), [values.energyMonitoring, credits.eeCr5]);
    
    const displayEeCr1Total = Math.min(eeCr1Points, 10);

    const renderPage = () => {
        switch (currentPage) {
            case 'ee-cr-1':
                return <CreditDetailPage onBack={() => setCurrentPage('landing')} values={values} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credits={credits.eeCr1} totalPoints={eeCr1Points} approach={approach} onApproachChange={setApproach} />;
            case 'ee-cr-2':
                return <AlternateWaterHeatingPage onBack={() => setCurrentPage('landing')} values={values.waterHeating} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credit={credits.eeCr2} />;
            case 'ee-cr-3':
                return <OnSiteRenewableEnergyPage onBack={() => setCurrentPage('landing')} values={values.renewableEnergy} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credit={credits.eeCr3} />;
            case 'ee-cr-4':
                return <CommonAreaEquipmentPage onBack={() => setCurrentPage('landing')} values={values.commonEquipment} onValueChange={handleValueChange} credit={credits.eeCr4} />;
            case 'ee-cr-5':
                return <EnergyMonitoringPage onBack={() => setCurrentPage('landing')} values={values.energyMonitoring} onValueChange={handleValueChange} credit={credits.eeCr5} />;
            default:
                return <LandingPage onNavigate={setCurrentPage} points={{ eeCr1: displayEeCr1Total, eeCr2: eeCr2Points, eeCr3: eeCr3Points, eeCr4: eeCr4Points, eeCr5: eeCr5Points }} />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans p-4">
            <div className="w-full max-w-5xl mx-auto">
                <div className="mb-6 text-center"><h1 className="text-2xl md:text-3xl font-bold text-gray-800">IGBC Green Homes</h1><p className="text-gray-500 mt-1">Credit Compliance Calculator</p></div>
                {renderPage()}
                <p className="text-center text-xs text-gray-400 mt-8">This is an interactive tool for estimation purposes. Please refer to official IGBC guidelines for final certification.</p>
            </div>
        </div>
    );
};

export default App;