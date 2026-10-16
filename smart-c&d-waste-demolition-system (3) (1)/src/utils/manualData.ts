/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ManualChapter } from "../types";

export const MANUAL_CHAPTERS: ManualChapter[] = [
  {
    id: "chap1",
    title: "1. Introduction",
    content: `Construction and Demolition (C&D) waste accounts for more than 35-40% of the worldwide solid waste generation. Rapid urbanization, infrastructural renewal, and high obsolescence rates of old structural configurations have multiplied demolition volumes exponentially. 

In modern civil engineering, demolition is no longer viewed as sheer destruction, but as a systematic "deconstruction process" designed to divert raw components away from collapsing landfills. Implementing efficient, automated segregation, estimation, and economic profiling systems has become a crucial regulatory requirement.`
  },
  {
    id: "chap2",
    title: "2. Types of C&D Waste",
    content: `C&D waste consists of highly diverse materials depending on whether the source structure is residential, industrial, road, or bridge. The materials are categorized as follows:
    
- **Inert Materials:** Heavily loaded structural ingredients like concrete blocks, foundation stone, burnt-clay bricks, paving gravel, and deep excavation soil.
- **Metal Scraps:** Tension reinforcement steel bars, iron pipes, galvanized window grills, structural columns, and high-value copper electrical cables.
- **Organic/Biodegradable:** Timber rafters, wooden doors, modular cabinetry, roof boards, and landscape residues.
- **Polymeric/Plastics:** Polyvinyl Chloride (PVC) plumbing conduits, conduits, insulation packings, nylon panels, and polymer pipes.
- **Fragiles & Ceramics:** Float glass window panes, glazed vitrified tiles, sanitary toilet fixtures, clay tiles, and gypsum boards.
- **Hazardous Residues:** Asbestos roof sheets, chemicals, old lead-acid paint flakes, and heavy organic sealants.`
  },
  {
    id: "chap3",
    title: "3. Reuse and Recycling Potential",
    content: `Practically all major non-hazardous components of demolition debris can be cycled into secondary production routes:

- **Concrete Aggregates:** Demolished concrete can be processed at stationary or mobile crushing units to yield Reclaimed Concrete Aggregates (RCA). RCA is actively employed in road sub-bases, drainage layers, light pavement structures, and structural concrete block manufacturing.
- **Reinforced Steel:** Steel bars can be directly re-rolled in small scrap mills or smelted to form high-grade structural TMT bars with zero loss in tensile properties.
- **Burnt Clay Bricks:** Careful deconstruction preserves up to 75-80% of brick units. Once cleaned of old lime or cement mortar, structural masonry bricks can be reused directly in low-rise partitions or crushed into brick grit (surkhi) for water-proofing.
- **Glass Cullet:** Crushed glass serves as silica substitute in aggregate concrete or is standardly melted in furnace factories for manufacturing glass wool, fiberglass, or industrial glass containers.`
  },
  {
    id: "chap4",
    title: "4. Regulatory Guidelines & Standards",
    content: `Management of C&D waste is governed by stringent federal and local guidelines. In India, the **Construction and Demolition Waste Management Rules, 2016** mandate:
    
1. **Source Segregation:** Mandatory separation of waste into different streams (concrete, steel, brick, soil, wood) by the waste generator prior to transport.
2. **Waste Management Plans:** Demolition of structures exceeding 300+ square meters require structured municipality approvals based on rigorous waste management plans.
3. **Recycling Targets:** Promoting the use of processed recycled aggregates up to 10-20% in public construction works and urban landscaping.
4. **Disposal Tariffs:** Strict penalty mechanisms for indiscriminate fly-tipping and dumping in non-designated zones.`
  },
  {
    id: "chap5",
    title: "5. Site Waste Segregation Plan",
    content: `An action-oriented Site Waste Segregation Plan (SWSP) constitutes the core operational guide on a demolition layout:

- **Pre-Demolition Audit:** Identify structural vs. non-structural boundaries, quantify target volumes, and locate toxic compounds (like asbestos) requiring isolation.
- **Designated Staging Areas:** Layout clear marked fields or bins directly on the property with custom labeling.
- **Sequential Deconstruction Workflow:** Stripping non-structural interiors (doors, plumbing, electrical fixtures) first, followed by interior plasterboard partitions, structural roofs, then beams, columns, and slabs in reverse order of installation.
- **On-site Training:** Instruct labor teams on color-coded sorting protocols to avoid inter-mixing inert concrete with timber or electrical cabling.`
  },
  {
    id: "chap6",
    title: "6. Waste Collection, Storage & Transportation",
    content: `Safeguarding material purity requires strict transit management:

- **White/Grey Bins (Inert Concrete & Brick):** Kept dry to prevent clumping. Concrete crushing requires zero contaminant mixtures.
- **Blue Bins (Steel & Metals):** Placed in covered zones to avoid heavy rusting. Secured with barricades against metal theft.
- **Green Bins (Wood & Timber):** Protected from rain and termite infestations.
- **Hazardous Storage (Red Class):** Completely non-permeable drums kept isolated under constant locking.
- **Heavy Cargo Trucking:** Vehicles must use canvas tarpaulin sheets to suppress micro-dust dispersion during transit. Load limits must align with regional dumper capacities (e.g., 5,000 kg to 10,000 kg).`
  },
  {
    id: "chap7",
    title: "7. Tools, Equipment & Safety Measures",
    content: `Industrial demolition demands highly specialized mechanical assets:

- **Hydraulic Excavators & Shearers:** For concrete crushing, high-reach crushing, and structural shearing of iron grids.
- **Pulverizers & Compactors:** For on-site aggregate downsizing and footprint compaction.
- **Magnetic Separators:** Electromagnet grids that effortlessly siphon steel bindings out of concrete aggregates.
- **Personal Protective Equipment (PPE):** Safety helmets, heavy steel-toed boots, respirator masks (essential to combat micro-concrete dust inhalation), safety goggles, and high-visibility jackets.
- **Dust Suppression Cannons:** Pressurized atomized water mist sprayers directed at collapse points of structural slabs.`
  },
  {
    id: "chap8",
    title: "8. Roles & Responsibilities",
    content: `Clear operational accountability keeps site management spotless:

- **Project Developer / Owner:** Secures municipal deconstruction permits, files the initial pre-demolition audit report, and coordinates overall funding.
- **Civil Site Engineer (C&D Officer):** Formulates calculation estimates, oversees sorting staging layouts, verifies safety conditions, and logs transport manifests.
- **Sorting Workforce:** Manually extracts high-value doors, fixtures, copper lines, and places inert stones in specific bins.
- **Authorized Recyclers:** Receives siphoned debris, issues official recycling certificates, and supplies RCA aggregates back to secondary markets.`
  },
  {
    id: "chap9",
    title: "9. Monitoring & Documentation",
    content: `Regulatory compliance requires transparent tracing of deconstruction outcomes:

- **Daily Log Sheet:** Tracks the quantity of material categories siphoned off.
- **Chain of Custody Manifests:** Signed transit slips detailing departure time, truck driver details, volumetric load, selected city landfill, and recycling factory receipts.
- **Diversion Rate Audits:** Calculation check comparing actual weight recycled/reused against initial structural estimation parameters. This generates the project's **Sustainability Index (0-100)** to qualify for carbon rating and green-building certificates.`
  },
  {
    id: "chap10",
    title: "10. Best Practices for Waste Reduction",
    content: `Modern civil practices prioritize minimization before deconstruction:

- **Modular Fabrication:** Standardizing layout spans so building renovations yield minimal panel off-cuts.
- **Adaptive Reuse:** Retaining old structural foundations, steel skeletons, and columns while updating interior non-structural elements only.
- **Dry-Joint Drywalling:** Installing dry mechanical partition fixings (screws) instead of plaster-mortared brick partitions to facilitate seamless partition removal without breakage debris.
- **Material Passports:** Creating digital databases of building materials (BIM-based) during construction to streamline demolition segregation 50 years later.`
  },
  {
    id: "chap11",
    title: "11. Conclusion & References",
    content: `Transitioning from indiscriminate rubble dumping to selective engineering demolition estimation yields remarkable rewards. Dynamic calculation tools empower site coordinators to verify financial recovery, suppress heavy transportation expenses, minimize landfill taxations, and maintain a high environmental status. 

### References & Codes:
1. **IS: 4130 - 1991:** Indian Standard Code of Safety for Demolition of Buildings.
2. **IS: 383 - 2016:** Indian Standard Specification for Coarse and Fine Aggregates.
3. **Ministry of Environment, Forest, and Climate Change (MoEFCC):** Construction and Demolition Waste Management Rules, 2016.
4. **Swachh Bharat Mission 2.0 Guidelines (2021-2026):** Focus on 100% processing of C&D Waste in Indian Urban Local Bodies.
5. **EPD Guidelines:** European Environmental Protection Directives for sustainable raw diversion.`
  }
];
