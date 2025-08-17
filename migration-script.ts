// migration-script.ts
import { appDb } from "./src/db";
import { drafts } from "./src/db/schema/drafts";
import { eq } from "drizzle-orm";

// Key mapping from old to new format
const keyMapping = {
  'BAN_1': 'SELECTION_1',
  'BAN_2': 'SELECTION_2',
  'BAN_3': 'SELECTION_3',
  'BAN_4': 'SELECTION_4',
  'BAN_5': 'SELECTION_5',
  'BAN_6': 'SELECTION_6',
  'BAN_7': 'SELECTION_7',
  'PICK_1': 'SELECTION_8',
  'PICK_2': 'SELECTION_9',
  'BAN_8': 'SELECTION_10',
  'BAN_9': 'SELECTION_11',
  'BAN_10': 'SELECTION_12',
  'PICK_3': 'SELECTION_13',
  'PICK_4': 'SELECTION_14',
  'PICK_5': 'SELECTION_15',
  'PICK_6': 'SELECTION_16',
  'PICK_7': 'SELECTION_17',
  'PICK_8': 'SELECTION_18',
  'BAN_11': 'SELECTION_19',
  'BAN_12': 'SELECTION_20',
  'BAN_13': 'SELECTION_21',
  'BAN_14': 'SELECTION_22',
  'PICK_9': 'SELECTION_23',
  'PICK_10': 'SELECTION_24'
};

async function migrateDrafts() {
  console.log('Starting migration...');
  
  // Fetch all drafts from the database
  const allDrafts = await appDb.select().from(drafts);
  console.log(`Found ${allDrafts.length} drafts to process`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  // Process each draft
  for (const draft of allDrafts) {
    try {
      // Skip if no persisted snapshot
      if (!draft.persistedMachineSnapshot) {
        skippedCount++;
        continue;
      }
      
      // Force cast to any to bypass type checking
      const snapshot = draft.persistedMachineSnapshot as any;
      
      // Check if it has the old format
      if (snapshot.context && snapshot.context.draft) {
        const oldDraft = snapshot.context.draft as any;
        const newDraft: any = {};
        
        // Look for old format keys in draft object
        const oldKeys = Object.keys(oldDraft).filter(
          key => key.startsWith('BAN_') || key.startsWith('PICK_')
        );
        
        // Check if value is in old format
        const valueNeedsUpdate = typeof snapshot.value === 'string' && 
            (snapshot.value.startsWith('BAN_') || snapshot.value.startsWith('PICK_'));
        
        if (oldKeys.length === 0 && !valueNeedsUpdate) {
          skippedCount++;
          continue;
        }
        
        // Convert keys if there are any old keys
        if (oldKeys.length > 0) {
          for (const oldKey of oldKeys) {
            // @ts-ignore
            const newKey = keyMapping[oldKey];
            if (newKey) {
              newDraft[newKey] = oldDraft[oldKey];
            }
          }
          
          // Keep any other keys that might be there
          for (const key of Object.keys(oldDraft)) {
            if (!key.startsWith('BAN_') && !key.startsWith('PICK_')) {
              newDraft[key] = oldDraft[key];
            }
          }
          
          // Replace the draft object
          snapshot.context.draft = newDraft;
        }
        
        // Update the value if it's a BAN_ or PICK_
        if (typeof snapshot.value === 'string' && 
            (snapshot.value.startsWith('BAN_') || 
             snapshot.value.startsWith('PICK_'))) {
          // @ts-ignore
          const newValue = keyMapping[snapshot.value];
          if (newValue) {
            snapshot.value = newValue;
          }
        }
        
        // Update in database
        await appDb
          .update(drafts)
          .set({ persistedMachineSnapshot: snapshot })
          .where(eq(drafts.id, draft.id));
        
        updatedCount++;
        console.log(`Updated draft ${draft.id}`);
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error processing draft ${draft.id}:`, error);
      skippedCount++;
    }
  }
  
  console.log(`Migration completed! Updated: ${updatedCount}, Skipped: ${skippedCount}`);
}

// Run the migration
migrateDrafts()
  .then(() => {
    console.log('Migration successfully completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during migration:', err);
    process.exit(1);
  });