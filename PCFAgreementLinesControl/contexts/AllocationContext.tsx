import React from 'react';

import { AllocationModel } from '../models/AllocationModel';

export const AllocationContext = React.createContext<AllocationModel[]>([]);
