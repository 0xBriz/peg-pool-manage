import { Module } from '@nestjs/common';
import { PegPool } from './peg';

@Module({
  imports: [],
  controllers: [],
  providers: [PegPool],
})
export class AppModule {
  constructor(peg: PegPool) {
    peg.run();
  }
}
